(() => {
  const STORAGE_KEY = 'chapter_edits_v1';

  function loadEdits() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function saveEdits(edits) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
  }

  function applyEdits() {
    const edits = loadEdits();
    Object.entries(edits).forEach(([id, html]) => {
      const sec = document.getElementById(id);
      if (!sec) return;
      sec.innerHTML = html;
    });
  }

  function createEditor() {
    const editor = document.createElement('div');
    editor.id = 'editor-modal';
    editor.style.cssText = 'position:fixed;inset:0;display:none;align-items:center;justify-content:center;z-index:11000';
    editor.innerHTML = `
      <div style="position:absolute;inset:0;background:rgba(0,0,0,0.65);"></div>
      <div style="position:relative;width:800px;max-width:96%;max-height:90%;background:var(--sbg,#111);color:#e6edf3;padding:18px;border-radius:14px;overflow:hidden;display:flex;flex-direction:column;gap:12px;box-shadow:0 18px 50px rgba(0,0,0,0.6)">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
          <strong>Editor de capítulo</strong>
          <button id="editor-close" style="background:none;border:none;color:#e6edf3;font-weight:700;cursor:pointer">Fechar</button>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <label style="font-size:0.85rem;color:#cbd5e1">Capítulo:</label>
          <select id="editor-section" style="flex:1;min-width:220px;padding:8px 10px;border-radius:10px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:#e6edf3"></select>
          <button id="editor-apply" style="background:#10b981;color:#081018;border:none;padding:8px 12px;border-radius:10px;cursor:pointer;font-weight:700">Aplicar</button>
          <button id="editor-save" style="background:#3b82f6;color:white;border:none;padding:8px 12px;border-radius:10px;cursor:pointer;font-weight:700">Salvar</button>
          <button id="editor-revert" style="background:#ef4444;color:white;border:none;padding:8px 12px;border-radius:10px;cursor:pointer;font-weight:700">Reverter</button>
        </div>
        <div style="display:flex;gap:10px;flex:1;min-height:200px;overflow:hidden">
          <textarea id="editor-input" style="flex:1;background:rgba(255,255,255,0.04);color:#e6edf3;border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:12px;resize:none;min-height:200px;font-family:ui-monospace,monospace;font-size:0.85rem;line-height:1.4" spellcheck="false"></textarea>
          <div id="editor-preview" style="flex:1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:12px;overflow:auto;font-size:0.9rem;line-height:1.5"></div>
        </div>
        <div id="editor-status" style="font-size:0.85rem;color:#9ca3af"></div>
      </div>
    `;

    document.body.appendChild(editor);

    const select = editor.querySelector('#editor-section');
    const input = editor.querySelector('#editor-input');
    const preview = editor.querySelector('#editor-preview');
    const status = editor.querySelector('#editor-status');
    const closeBtn = editor.querySelector('#editor-close');
    const applyBtn = editor.querySelector('#editor-apply');
    const saveBtn = editor.querySelector('#editor-save');
    const revertBtn = editor.querySelector('#editor-revert');

    const sections = Array.from(document.querySelectorAll('section[id]'))
      .filter((s) => s.id && s.id !== 'capa');

    sections.forEach((sec) => {
      const opt = document.createElement('option');
      opt.value = sec.id;
      opt.textContent = `${sec.id} — ${sec.querySelector('h2')?.textContent || sec.id}`;
      select.appendChild(opt);
    });

    function updatePreview() {
      preview.innerHTML = input.value;
    }

    function loadSection(id) {
      const sec = document.getElementById(id);
      if (!sec) return;
      const edits = loadEdits();
      const html = edits[id] || sec.innerHTML;
      input.value = html;
      updatePreview();
      status.textContent = edits[id] ? 'Editado localmente (não salvo)' : 'Sem edição local.';
    }

    function open() {
      editor.style.display = 'flex';
      const id = select.value || sections[0]?.id;
      if (id) loadSection(id);
      setTimeout(() => input.focus(), 100);
    }

    function close() {
      editor.style.display = 'none';
    }

    select.addEventListener('change', () => loadSection(select.value));
    input.addEventListener('input', updatePreview);

    applyBtn.addEventListener('click', () => {
      const id = select.value;
      const sec = document.getElementById(id);
      if (!sec) return;
      sec.innerHTML = input.value;
      status.textContent = 'Aplicado localmente (sem salvar).';
    });

    saveBtn.addEventListener('click', () => {
      const edits = loadEdits();
      edits[select.value] = input.value;
      saveEdits(edits);
      status.textContent = 'Salvo. Recarregue para aplicar em outros casos.';
    });

    revertBtn.addEventListener('click', () => {
      if (!confirm('Reverter edição local para este capítulo?')) return;
      const edits = loadEdits();
      delete edits[select.value];
      saveEdits(edits);
      loadSection(select.value);
      status.textContent = 'Alteração revertida.';
    });

    closeBtn.addEventListener('click', close);

    // Allow closing with Escape
    window.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && editor.style.display === 'flex') {
        close();
      }
    });

    return { open };
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyEdits();
    const editor = createEditor();

    const btn = document.createElement('button');
    btn.textContent = 'Editar capítulo';
    btn.style.cssText = 'position:fixed;right:16px;bottom:60px;z-index:10999;background:#f59e0b;color:#000;border:none;padding:10px 14px;border-radius:12px;cursor:pointer;font-weight:700';
    btn.addEventListener('click', () => editor.open());
    document.body.appendChild(btn);
  });
})();
