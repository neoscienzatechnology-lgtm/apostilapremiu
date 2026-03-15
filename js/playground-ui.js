/* Playground UI
 Adds a "Playground" button to each chapter header and opens a modal playground
 that uses the existing SecurePlayground class (js/playground.js).
*/
(function(){
  let instance = null;

  function createModal() {
    const modal = document.createElement('div');
    modal.id = 'playground-modal';
    modal.style.cssText = 'position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,0.6);z-index:10050;padding:18px';

    modal.innerHTML = `
      <div style="background:var(--pbg);color:var(--sbg);max-width:900px;width:100%;border-radius:12px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.6);">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.04);">
          <div style="font-weight:700;color:#fff">Playground</div>
          <div>
            <button id="pg-close" style="background:none;border:1px solid rgba(255,255,255,0.06);color:#fff;padding:6px 10px;border-radius:8px;cursor:pointer">Fechar</button>
          </div>
        </div>
        <div style="display:flex;gap:0;flex-direction:column;padding:12px;">
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
            <label style="color:#9ca3af;font-size:13px">Exemplo:</label>
            <select id="pg-samples" style="flex:1;padding:6px;border-radius:6px;background:#071025;color:#fff;border:1px solid rgba(255,255,255,0.04);display:none"></select>
          </div>
          <textarea class="pg-editor" placeholder="Escreva código JavaScript aqui..." style="width:100%;min-height:220px;padding:12px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:#0b1220;color:#fff;font-family:monospace;font-size:13px"></textarea>
          <div style="display:flex;gap:8px;align-items:center;margin-top:8px;">
            <button class="pg-run" style="background:#10b981;color:#fff;border:none;padding:10px 12px;border-radius:8px;cursor:pointer;font-weight:700">Executar (Ctrl+Enter)</button>
            <button class="pg-clear" style="background:#ef4444;color:#fff;border:none;padding:10px 12px;border-radius:8px;cursor:pointer">Limpar</button>
            <div style="flex:1;color:#9ca3af;font-size:13px">Saída:</div>
          </div>
          <pre class="pg-out" style="background:#071025;color:#e6edf3;padding:12px;border-radius:8px;margin-top:8px;min-height:80px;white-space:pre-wrap;font-family:monospace;font-size:13px"></pre>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#pg-close').addEventListener('click', () => { modal.style.display='none'; destroyInstance(); });
    modal.addEventListener('click', (e) => { if (e.target === modal) { modal.style.display='none'; destroyInstance(); } });
    modal.querySelector('.pg-clear').addEventListener('click', () => {
      modal.querySelector('.pg-editor').value = '';
      modal.querySelector('.pg-out').textContent = '';
    });

    return modal;
  }

  function destroyInstance(){
    if (instance && instance.destruir) instance.destruir();
    instance = null;
  }

  function openPlayground(prefill) {
    let modal = document.getElementById('playground-modal');
    if (!modal) modal = createModal();
    const editor = modal.querySelector('.pg-editor');
    const output = modal.querySelector('.pg-out');
    const runBtn = modal.querySelector('.pg-run');
    const samplesSelect = modal.querySelector('#pg-samples');

    // prefill can be string or array of {title, code}
    if (typeof prefill === 'string') {
      samplesSelect.style.display = 'none';
      editor.value = prefill;
    } else if (Array.isArray(prefill) && prefill.length > 0) {
      // populate select
      samplesSelect.innerHTML = '';
      prefill.forEach((s, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = s.title || `Exemplo ${idx+1}`;
        samplesSelect.appendChild(opt);
      });
      samplesSelect.style.display = '';
      // set first
      editor.value = prefill[0].code || '';
      samplesSelect.onchange = function() { editor.value = prefill[this.value].code || ''; };
    } else {
      samplesSelect.style.display = 'none';
      editor.value = '';
    }
    modal.style.display = 'flex';

    // instantiate SecurePlayground
    const idEditor = `pg-e-${Date.now()}`;
    const idOut = `pg-o-${Date.now()}`;
    const idRun = `pg-r-${Date.now()}`;
    editor.id = idEditor; output.id = idOut; runBtn.id = idRun;

    // dynamically import the SecurePlayground module and instantiate
    destroyInstance();
    import('./playground.js').then(mod => {
      const SP = mod.SecurePlayground || mod.default;
      if (SP) {
        try {
          instance = new SP(idEditor, idOut, idRun);
        } catch (err) {
          console.error('Playground init failed', err);
          instance = null;
        }
      }
    }).catch(err => {
      console.error('Failed to load playground module', err);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // add a small playground button to each section header
    document.querySelectorAll('section[id]').forEach(section => {
      const id = section.id; if (!id) return;
      const h2 = section.querySelector('h2'); if (!h2) return;
      const btn = document.createElement('button');
      btn.className = 'open-playground-btn';
      btn.textContent = 'Playground';
      btn.style.cssText = 'margin-left:10px;padding:6px 8px;border-radius:6px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:#f59e0b;cursor:pointer;font-weight:700;font-size:12px';
      btn.addEventListener('click', () => {
        // collect all <pre> examples in the section
        const pres = Array.from(section.querySelectorAll('pre'));
        if (pres.length === 0) {
          openPlayground('');
          return;
        }

        const samples = pres.map((p, idx) => {
          const code = p.innerText.trim();
          const title = p.getAttribute('data-sample-title') || (`Exemplo ${idx+1}`);
          return { title, code };
        });

        openPlayground(samples);
      });
      h2.appendChild(btn);
    });
  });

})();
