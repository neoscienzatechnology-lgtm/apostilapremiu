(() => {
  function createModal() {
    const modal = document.createElement('div');
    modal.id = 'sync-modal';
    modal.style.cssText = 'position:fixed;inset:0;display:none;align-items:center;justify-content:center;z-index:11000';

    const backdrop = document.createElement('div');
    backdrop.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(2px)';
    modal.appendChild(backdrop);

    const box = document.createElement('div');
    box.style.cssText = 'position:relative;width:520px;max-width:94%;background:var(--sbg,#111);color:#e6edf3;padding:18px;border-radius:12px;border:1px solid rgba(255,255,255,0.04);box-shadow:0 10px 40px rgba(0,0,0,0.6)';
    modal.appendChild(box);

    box.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <strong>Sincronização — Exportar / Importar</strong>
        <button id="sync-close" style="background:none;border:none;color:#e6edf3;font-weight:700;cursor:pointer">Fechar</button>
      </div>
      <div style="margin-bottom:8px;font-size:0.9rem;color:#cbd5e1">Exporte ou importe seus dados locais (notas, SRS, progresso, favoritos). Arquivo JSON.</div>
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:12px">
        <button id="sync-export" style="background:#10b981;color:#081018;border:none;padding:8px 12px;border-radius:8px;cursor:pointer;font-weight:700">Exportar dados</button>
        <input id="sync-file" type="file" accept="application/json" style="color:transparent;background:transparent">
        <button id="sync-import" style="background:#3b82f6;color:white;border:none;padding:8px 12px;border-radius:8px;cursor:pointer;font-weight:700">Importar arquivo</button>
      </div>
      <div id="sync-msg" style="font-size:0.85rem;color:#9ca3af"></div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#sync-close').addEventListener('click', () => { modal.style.display = 'none'; });

    modal.querySelector('#sync-export').addEventListener('click', () => {
      try {
        const obj = {};
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          obj[k] = localStorage.getItem(k);
        }
        const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'apostila-data.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        modal.querySelector('#sync-msg').textContent = 'Exportação pronta — arquivo baixado.';
      } catch (e) {
        modal.querySelector('#sync-msg').textContent = 'Erro ao exportar: ' + e.message;
      }
    });

    modal.querySelector('#sync-import').addEventListener('click', () => {
      const f = modal.querySelector('#sync-file').files[0];
      if (!f) { modal.querySelector('#sync-msg').textContent = 'Escolha um arquivo JSON para importar.'; return; }
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (!confirm('Importarará e substituirá itens locais existentes com o mesmo nome. Confirmar?')) return;
          Object.keys(parsed).forEach(k => {
            try { localStorage.setItem(k, parsed[k]); } catch (e) { /* ignore individual errors */ }
          });
          modal.querySelector('#sync-msg').textContent = 'Importação concluída. Recarregue a página para aplicar.';
        } catch (err) {
          modal.querySelector('#sync-msg').textContent = 'Arquivo inválido: ' + err.message;
        }
      };
      reader.readAsText(f);
    });

    return modal;
  }

  function createFloatingButton(modal) {
    const btn = document.createElement('button');
    btn.id = 'sync-btn';
    btn.title = 'Exportar / Importar dados locais';
    btn.style.cssText = 'position:fixed;right:16px;bottom:110px;z-index:10999;background:#111827;color:#f8fafc;border-radius:12px;padding:10px 14px;border:1px solid rgba(255,255,255,0.04);cursor:pointer;font-weight:700';
    btn.textContent = 'Sincronizar';
    btn.addEventListener('click', () => { modal.style.display = 'flex'; });
    document.body.appendChild(btn);
  }

  document.addEventListener('DOMContentLoaded', () => {
    try {
      const modal = createModal();
      createFloatingButton(modal);
    } catch (e) {
      console.error('sync.js init error', e);
    }
  });
})();
