/**
 * Sistema de Notas Pessoais
 * Permite usuário adicionar anotações em cada capítulo
 */

export class NotesSystem {
  constructor() {
    this.storageKey = 'notas_pessoais';
    this.notas = this.carregarNotas();
    this.init();
  }

  init() {
    this.adicionarBotoesNotas();
    this.criarModalNotas();
  }

  // Adiciona botão de notas em cada seção
  adicionarBotoesNotas() {
    document.querySelectorAll('section[id]').forEach(section => {
      const id = section.id;
      if (!id || id === 'capa' || id === 'ementa') return;

      const header = section.querySelector('h2');
      if (!header) return;

      const btnContainer = document.createElement('div');
      btnContainer.className = 'notes-btn-container';
      btnContainer.style.cssText = 'display: inline-flex; gap: 8px; margin-left: 12px;';

      // Botão de adicionar/editar nota
      const btnNota = document.createElement('button');
      btnNota.className = 'btn-nota no-print';
      btnNota.innerHTML = this.notas[id] ? '📝' : '📄';
      btnNota.title = this.notas[id] ? 'Editar nota' : 'Adicionar nota';
      btnNota.style.cssText = `
        background: none;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        padding: 4px 8px;
        cursor: pointer;
        font-size: 16px;
        transition: all 0.2s;
      `;
      
      btnNota.addEventListener('mouseenter', () => {
        btnNota.style.borderColor = '#6366f1';
        btnNota.style.transform = 'scale(1.1)';
      });
      
      btnNota.addEventListener('mouseleave', () => {
        btnNota.style.borderColor = '#d1d5db';
        btnNota.style.transform = 'scale(1)';
      });

      btnNota.addEventListener('click', (e) => {
        e.preventDefault();
        this.abrirModal(id, section.querySelector('h2').textContent);
      });

      btnContainer.appendChild(btnNota);

      // Badge de contagem de caracteres (se houver nota)
      if (this.notas[id]) {
        const badge = document.createElement('span');
        badge.className = 'nota-badge';
        badge.textContent = this.notas[id].texto.length + ' chars';
        badge.style.cssText = `
          font-size: 10px;
          background: #6366f1;
          color: white;
          padding: 2px 6px;
          border-radius: 10px;
          font-weight: 600;
        `;
        btnContainer.appendChild(badge);
      }

      header.appendChild(btnContainer);
    });
  }

  // Criar modal de notas
  criarModalNotas() {
    const modal = document.createElement('div');
    modal.id = 'modal-notas';
    modal.className = 'modal-notas';
    modal.style.cssText = `
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      z-index: 9999;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(4px);
    `;

    modal.innerHTML = `
      <div class="modal-content" style="
        background: white;
        border-radius: 16px;
        padding: 30px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 id="modal-titulo" style="font-size: 20px; font-weight: 700; color: #1a202c; margin: 0;">
            Minhas Notas
          </h3>
          <button id="modal-fechar" style="
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6b7280;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            transition: all 0.2s;
          ">×</button>
        </div>
        
        <textarea id="nota-texto" placeholder="Digite suas anotações aqui...&#10;&#10;💡 Dicas:&#10;• Use para resumir conceitos&#10;• Anote dúvidas para revisar depois&#10;• Marque pontos importantes" style="
          width: 100%;
          min-height: 200px;
          padding: 15px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          resize: vertical;
          outline: none;
          transition: border-color 0.2s;
        "></textarea>
        
        <div style="display: flex; gap: 10px; margin-top: 15px; font-size: 12px; color: #6b7280;">
          <span id="nota-chars">0 caracteres</span>
          <span>•</span>
          <span id="nota-data"></span>
        </div>
        
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button id="nota-salvar" style="
            flex: 1;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            border: none;
            padding: 12px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
          ">💾 Salvar Nota</button>
          
          <button id="nota-excluir" style="
            background: #ef4444;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
          ">🗑️</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector('#modal-fechar').addEventListener('click', () => this.fecharModal());
    modal.querySelector('#nota-salvar').addEventListener('click', () => this.salvarNota());
    modal.querySelector('#nota-excluir').addEventListener('click', () => this.excluirNota());
    
    const textarea = modal.querySelector('#nota-texto');
    textarea.addEventListener('input', () => {
      modal.querySelector('#nota-chars').textContent = textarea.value.length + ' caracteres';
    });

    textarea.addEventListener('focus', function() {
      this.style.borderColor = '#6366f1';
    });

    textarea.addEventListener('blur', function() {
      this.style.borderColor = '#e5e7eb';
    });

    // Fechar ao clicar fora
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.fecharModal();
    });

    // Atalho ESC para fechar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        this.fecharModal();
      }
    });
  }

  // Abrir modal
  abrirModal(capituloId, titulo) {
    this.capituloAtual = capituloId;
    const modal = document.getElementById('modal-notas');
    const textarea = modal.querySelector('#nota-texto');
    const notaData = modal.querySelector('#nota-data');
    
    modal.querySelector('#modal-titulo').textContent = `Notas: ${titulo}`;
    
    const nota = this.notas[capituloId];
    if (nota) {
      textarea.value = nota.texto;
      notaData.textContent = `Última edição: ${this.formatarData(nota.data)}`;
      modal.querySelector('#nota-chars').textContent = nota.texto.length + ' caracteres';
    } else {
      textarea.value = '';
      notaData.textContent = 'Nova nota';
      modal.querySelector('#nota-chars').textContent = '0 caracteres';
    }

    modal.style.display = 'flex';
    textarea.focus();
  }

  // Fechar modal
  fecharModal() {
    const modal = document.getElementById('modal-notas');
    modal.style.display = 'none';
    this.capituloAtual = null;
  }

  // Salvar nota
  salvarNota() {
    const textarea = document.querySelector('#nota-texto');
    const texto = textarea.value.trim();

    if (!texto) {
      alert('⚠️ Digite algum texto antes de salvar!');
      return;
    }

    this.notas[this.capituloAtual] = {
      texto,
      data: new Date().toISOString()
    };

    localStorage.setItem(this.storageKey, JSON.stringify(this.notas));
    
    this.mostrarToast('✓ Nota salva com sucesso!', 'success');
    this.fecharModal();
    
    // Atualizar UI
    setTimeout(() => window.location.reload(), 500);
  }

  // Excluir nota
  excluirNota() {
    if (!this.notas[this.capituloAtual]) {
      this.fecharModal();
      return;
    }

    if (!confirm('🗑️ Deseja realmente excluir esta nota?')) {
      return;
    }

    delete this.notas[this.capituloAtual];
    localStorage.setItem(this.storageKey, JSON.stringify(this.notas));
    
    this.mostrarToast('✓ Nota excluída', 'success');
    this.fecharModal();
    
    setTimeout(() => window.location.reload(), 500);
  }

  // Carregar notas do localStorage
  carregarNotas() {
    const dados = localStorage.getItem(this.storageKey);
    return dados ? JSON.parse(dados) : {};
  }

  // Formatar data
  formatarData(isoString) {
    const data = new Date(isoString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Toast notification
  mostrarToast(mensagem, tipo = 'info') {
    const toast = document.createElement('div');
    toast.textContent = mensagem;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 10px;
      font-weight: 600;
      z-index: 10000;
      animation: slideIn 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      ${tipo === 'success' ? 'background: #10b981; color: white;' : 'background: #3b82f6; color: white;'}
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}

// Inicializar automaticamente
document.addEventListener('DOMContentLoaded', () => {
  window.notesSystem = new NotesSystem();
});
