/* Exercises Autocheck
Usage in HTML:
<div class="exercise-wrap">
  <pre class="exercise-code">function sum(a,b){ return a+b }</pre>
  <pre class="exercise-tests" data-tests='[{"expr":"sum(2,3)","expected":5}]'></pre>
  OR
  <pre class="exercise-code">console.log('hello')</pre>
  <pre class="exercise-expected">hello</pre>
</div>

This script adds a "Verificar" button and runs tests in an iframe sandbox.
*/
(function(){
  function createResultEl() {
    const d = document.createElement('div');
    d.className = 'exercise-result';
    d.style.cssText = 'margin-top:8px;padding:8px;border-radius:8px;background:rgba(0,0,0,0.45);color:#fff;font-size:13px';
    return d;
  }

  function runInSandbox(code, tests, expectedText, callback) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.sandbox = 'allow-scripts';
    document.body.appendChild(iframe);

    const id = 'ex-' + Date.now() + Math.floor(Math.random()*1000);

    // build script executed inside iframe
    const script = [];
    script.push('window.__logs = [];');
    script.push(`console.log = function(){ window.__logs.push(Array.from(arguments).map(a=>{ try{return JSON.stringify(a);}catch(e){return String(a);} }).join(' ')); };`);
    script.push(`console.error = function(){ window.__logs.push('ERROR: '+Array.from(arguments).join(' ')); };`);
    script.push('\ntry{');
    script.push(code);
    script.push('\n} catch(e) { window.__err = e && e.message ? e.message : String(e); }');

    // tests JSON array
    if (tests) {
      script.push('\nwindow.__testsResults = [];');
      script.push('try{');
      script.push('  const __tests = ' + JSON.stringify(tests) + ';');
      script.push('  __tests.forEach((t, i) => { try{ const res = eval(t.expr); const ok = (typeof t.expected === "object") ? JSON.stringify(res) === JSON.stringify(t.expected) : String(res) === String(t.expected); window.__testsResults.push({i, ok, got:res, expected:t.expected}); } catch(e){ window.__testsResults.push({i, ok:false, error: (e && e.message)?e.message:String(e)}); } });');
      script.push('}catch(e){ window.__testsError = e && e.message ? e.message : String(e); }');
    }

    // gather and post message
    script.push('\nsetTimeout(function(){ parent.postMessage({ __logs: window.__logs, __err: window.__err, __testsResults: window.__testsResults, __testsError: window.__testsError }, "*"); }, 10);');

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write('<!doctype html><html><body><script>' + script.join('\n') + '<\/script></body></html>');
    doc.close();

    function handler(ev) {
      if (!ev.data) return;
      // accept message from iframe
      callback(ev.data);
      window.removeEventListener('message', handler);
      setTimeout(() => iframe.remove(), 100);
    }

    window.addEventListener('message', handler);
  }

  function createButtonFor(el) {
    const btn = document.createElement('button');
    btn.textContent = 'Verificar';
    btn.style.cssText = 'margin-left:8px;padding:6px 8px;border-radius:6px;border:none;background:#2563eb;color:#fff;cursor:pointer;font-weight:700';
    return btn;
  }

  // storage helpers for attempts and hints shown
  function loadAttemptsMap() {
    try { return JSON.parse(localStorage.getItem('exercise_attempts_v1') || '{}'); } catch(e) { return {}; }
  }
  function saveAttemptsMap(m) { localStorage.setItem('exercise_attempts_v1', JSON.stringify(m)); }

  // number of failed attempts required to show the next hint
  const HINT_THRESHOLD = 2;

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.exercise-wrap').forEach((wrap) => {
      const codeEl = wrap.querySelector('.exercise-code');
      if (!codeEl) return;

      const testsEl = wrap.querySelector('.exercise-tests');
      const expectedEl = wrap.querySelector('.exercise-expected');
      const hintsEl = wrap.querySelector('.exercise-hints');

      // compute stable exercise id: section-id + index
      const section = wrap.closest('section');
      const secId = section && section.id ? section.id : 'global';
      const wrapsInSection = section ? Array.from(section.querySelectorAll('.exercise-wrap')) : Array.from(document.querySelectorAll('.exercise-wrap'));
      const idx = wrapsInSection.indexOf(wrap);
      const exId = wrap.getAttribute('data-ex-id') || `${secId}-ex-${idx}`;

      // per-exercise hint threshold (fallback to global body attribute, then to HINT_THRESHOLD)
      const globalThresholdRaw = (document.body && (document.body.dataset && document.body.dataset.hintThreshold)) || (document.body && document.body.getAttribute && document.body.getAttribute('data-hint-threshold'));
      const perExerciseThresholdRaw = wrap.dataset && wrap.dataset.hintThreshold || wrap.getAttribute && wrap.getAttribute('data-hint-threshold');
      const hintThreshold = perExerciseThresholdRaw
        ? Math.max(1, parseInt(perExerciseThresholdRaw, 10) || HINT_THRESHOLD)
        : (globalThresholdRaw ? Math.max(1, parseInt(globalThresholdRaw, 10) || HINT_THRESHOLD) : HINT_THRESHOLD);

      // parse hints
      let hints = [];
      if (hintsEl) {
        if (hintsEl.dataset && hintsEl.dataset.hints) {
          try { hints = JSON.parse(hintsEl.dataset.hints || '[]'); } catch(e) { hints = []; }
        } else {
          // child elements with class 'hint'
          const childHints = Array.from(hintsEl.querySelectorAll('.hint'));
          if (childHints.length) hints = childHints.map(h=>h.textContent.trim());
          else {
            const raw = hintsEl.textContent || '';
            hints = raw.split(/\n-{3,}\n|---/).map(s=>s.trim()).filter(Boolean);
          }
        }
      }

      // insert verify button near header
      const header = wrap.querySelector('h3, h4, h2');
      const containerForBtn = header || wrap;
      const btn = createButtonFor(wrap);
      containerForBtn.appendChild(btn);

      // result and hints container
      let resultEl = wrap.querySelector('.exercise-result');
      if (!resultEl) { resultEl = createResultEl(); wrap.appendChild(resultEl); }
      let hintsContainer = wrap.querySelector('.exercise-hints-ui');
      if (!hintsContainer) {
        hintsContainer = document.createElement('div');
        hintsContainer.className = 'exercise-hints-ui';
        hintsContainer.style.cssText = 'margin-top:8px';
        wrap.appendChild(hintsContainer);
      }

      // load attempts state
      const attemptsMap = loadAttemptsMap();
      const state = attemptsMap[exId] || { attempts: 0, hintsShown: 0 };

      function showNextHint() {
        if (!hints || hints.length === 0) return;
        const next = state.hintsShown;
        if (next >= hints.length) return;
        const div = document.createElement('div');
        div.className = 'exercise-hint-item';
        div.style.cssText = 'margin-top:6px;padding:8px;border-radius:8px;background:rgba(255,255,255,0.03);color:#e6edf3';
        div.innerText = `Dica ${next+1}: ${hints[next]}`;
        hintsContainer.appendChild(div);
        state.hintsShown = next + 1;
        attemptsMap[exId] = state;
        saveAttemptsMap(attemptsMap);
      }

      // manual reveal button
      let revealBtn = wrap.querySelector('.exercise-reveal-hint');
      if (!revealBtn) {
        revealBtn = document.createElement('button');
        revealBtn.className = 'exercise-reveal-hint';
        revealBtn.textContent = 'Mostrar dica';
        revealBtn.style.cssText = 'margin-left:8px;padding:6px 8px;border-radius:6px;border:none;background:#f59e0b;color:#111;cursor:pointer;font-weight:700';
        revealBtn.addEventListener('click', () => showNextHint());
        containerForBtn.appendChild(revealBtn);
      }

      // pre-show hints according to hintsShown
      if (state.hintsShown && hints && hints.length > 0) {
        for (let i=0;i<state.hintsShown && i<hints.length;i++) {
          const div = document.createElement('div');
          div.className = 'exercise-hint-item';
          div.style.cssText = 'margin-top:6px;padding:8px;border-radius:8px;background:rgba(255,255,255,0.03);color:#e6edf3';
          div.innerText = `Dica ${i+1}: ${hints[i]}`;
          hintsContainer.appendChild(div);
        }
      }

      btn.addEventListener('click', () => {
        resultEl.textContent = '⏳ Verificando...';
        const code = codeEl.textContent || '';

        let tests = null;
        if (testsEl) {
          try { tests = JSON.parse(testsEl.getAttribute('data-tests') || testsEl.textContent || 'null'); } catch(e) { tests = null; }
        }

        const expectedText = expectedEl ? expectedEl.textContent.trim() : null;

        runInSandbox(code, tests, expectedText, (res) => {
          // build result
          const lines = [];
          let passedAll = true;

          if (res.__err) {
            lines.push('✗ Erro em execução: ' + res.__err);
            passedAll = false;
          }

          if (res.__testsError) {
            lines.push('✗ Erro nos testes: ' + res.__testsError);
            passedAll = false;
          }

          if (res.__testsResults) {
            const passed = res.__testsResults.filter(t=>t.ok).length;
            const total = res.__testsResults.length;
            if (passed !== total) passedAll = false;
            lines.push((passed===total? '✓ ':'✗ ') + `Testes: ${passed}/${total}`);
            res.__testsResults.forEach((t,i)=>{
              if (t.ok) lines.push(`  ✔ Test ${i+1}`);
              else if (t.error) lines.push(`  ✗ Test ${i+1} error: ${t.error}`);
              else lines.push(`  ✗ Test ${i+1} got=${JSON.stringify(t.got)} expected=${JSON.stringify(t.expected)}`);
            });
          } else if (expectedText !== null) {
            const logs = res.__logs || [];
            const out = logs.join('\n').trim();
            if (out === expectedText) lines.push('✓ Saída corresponde ao esperado');
            else { lines.push(`✗ Saída diferente. Esperado: ${expectedText} | Obtido: ${out}`); passedAll = false; }
          } else {
            const logs = res.__logs || [];
            if (logs.length) {
              lines.push('Saída:\n' + logs.join('\n'));
            } else {
              lines.push('Executado — sem saída para comparar.');
            }
          }

          // update attempts/hints on failure
          if (!passedAll) {
            state.attempts = (state.attempts || 0) + 1;
            // automatic hint thresholds: show hint 0 after 1 failed attempt, hint 1 after 2 failed attempts, etc.
            if (hints && hints.length > 0 && state.hintsShown < hints.length) {
              if (state.attempts >= (state.hintsShown + 1) * hintThreshold) {
                showNextHint();
                lines.push(`💡 Dica exibida (#${state.hintsShown})`);
              }
            }
          } else {
            // reset attempts on success
            state.attempts = 0;
          }

          attemptsMap[exId] = state;
          saveAttemptsMap(attemptsMap);

          resultEl.innerHTML = lines.map(l=>`<div>${l.replace(/</g,'&lt;')}</div>`).join('');
        });
      });
    });
  });

})();
