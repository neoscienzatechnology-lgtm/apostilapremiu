/* SRS Review UI
 - Adds a floating review button
 - Shows modal with due items from window.SRS
 - Allows marking quality: Again(0), Hard(3), Good(4), Easy(5)
*/
(function(){
  function createButton(){
    const btn = document.createElement('button');
    btn.id = 'srs-review-btn';
    btn.title = 'Revisar itens (SRS)';
    btn.style.cssText = 'position:fixed;right:16px;bottom:90px;background:#4338ca;color:#fff;border:none;padding:12px 14px;border-radius:999px;z-index:10000;box-shadow:0 8px 30px rgba(0,0,0,0.25);cursor:pointer;font-weight:700';
    btn.innerText = 'Revisar SRS';
    btn.addEventListener('click', openModal);
    document.body.appendChild(btn);
  }

  function openModal(){
    let modal = document.getElementById('srs-modal');
    if (!modal) modal = buildModal();
    refreshModal();
    modal.style.display = 'flex';
  }

  function buildModal(){
    const modal = document.createElement('div');
    modal.id = 'srs-modal';
    modal.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);align-items:center;justify-content:center;z-index:10001;padding:20px';
    modal.innerHTML = `
      <div style="background:#0b1220;color:#fff;border-radius:12px;max-width:860px;width:100%;max-height:80vh;overflow:auto;padding:18px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <h3 style="margin:0;font-size:18px">Revisão SRS</h3>
          <div>
            <button id="srs-close" style="background:none;border:1px solid rgba(255,255,255,0.08);color:#fff;padding:6px 10px;border-radius:8px;cursor:pointer">Fechar</button>
          </div>
        </div>
        <div id="srs-list" style="min-height:120px"></div>
        <div style="margin-top:12px;color:#9ca3af;font-size:13px">Itens são armazenados localmente. Use os botões para registrar sua memória.</div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#srs-close').addEventListener('click', () => modal.style.display='none');
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display='none'; });
    return modal;
  }

  function refreshModal(){
    const listEl = document.getElementById('srs-list');
    if (!listEl) return;
    const due = (window.SRS && window.SRS.getDueItems) ? window.SRS.getDueItems() : [];
    if (!due || due.length === 0) {
      listEl.innerHTML = '<div style="padding:18px;background:rgba(255,255,255,0.02);border-radius:8px;color:#d1d5db">Sem itens para revisão hoje. Bons estudos! ✅</div>';
      return;
    }

    const itemsHtml = due.map(it => {
      const id = it.id;
      const parts = id.split('-');
      const chapter = parts[0] || id;
      const link = document.getElementById(chapter) ? `#${chapter}` : './apostila-javascript-premium.html';
      const next = new Date(it.nextReview).toLocaleDateString();
      return `<div data-id="${id}" style="padding:12px;background:rgba(255,255,255,0.02);border-radius:8px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center">
        <div style="max-width:70%">
          <div style="font-weight:700">${id} — <a href="${link}" style="color:#f59e0b">Abrir capítulo</a></div>
          <div style="color:#9ca3af;font-size:13px">Próxima revisão: ${next} • EF: ${it.ef.toFixed(2)} • intervalo: ${it.interval}d</div>
        </div>
        <div style="display:flex;gap:8px">
          <button data-q="0" style="background:#ef4444;color:#fff;border:none;padding:8px 10px;border-radius:8px;cursor:pointer">Again</button>
          <button data-q="3" style="background:#f97316;color:#fff;border:none;padding:8px 10px;border-radius:8px;cursor:pointer">Hard</button>
          <button data-q="4" style="background:#f59e0b;color:#111;border:none;padding:8px 10px;border-radius:8px;cursor:pointer">Good</button>
          <button data-q="5" style="background:#10b981;color:#fff;border:none;padding:8px 10px;border-radius:8px;cursor:pointer">Easy</button>
        </div>
      </div>`;
    }).join('');

    listEl.innerHTML = itemsHtml;

    listEl.querySelectorAll('[data-q]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const quality = parseInt(btn.getAttribute('data-q'),10);
        const container = btn.closest('[data-id]');
        const id = container.getAttribute('data-id');
        try{
          window.SRS && window.SRS.record(id, quality);
          btn.textContent = '✓';
          setTimeout(refreshModal, 300);
        }catch(err){
          console.error(err); alert('Erro ao registrar.');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    if (!window.SRS) return;
    createButton();
  });

})();
