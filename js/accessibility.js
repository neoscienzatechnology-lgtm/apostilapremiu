/**
 * Módulo de Acessibilidade Avançada
 * WCAG 2.1 Level AA Compliance
 */

export class AccessibilityManager {
  constructor() {
    this.init();
  }

  init() {
    this.adicionarSkipLinks();
    this.melhorarARIA();
    this.navegacaoTeclado();
    this.anunciosLeitores();
    this.modoAltoContraste();
    this.ajustarFontes();
  }

  // Skip Links para navegação rápida
  adicionarSkipLinks() {
    const skipNav = document.createElement('nav');
    skipNav.className = 'skip-links';
    skipNav.setAttribute('aria-label', 'Links de navegação rápida');
    skipNav.innerHTML = `
      <a href="#main-content" class="skip-link">Pular para conteúdo principal</a>
      <a href="#nav-list" class="skip-link">Pular para menu</a>
      <a href="#search-input" class="skip-link">Pular para busca</a>
    `;

    document.body.insertBefore(skipNav, document.body.firstChild);

    // CSS para skip links
    const style = document.createElement('style');
    style.textContent = `
      .skip-links {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10000;
      }
      .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: #000;
        color: #fff;
        padding: 8px 16px;
        text-decoration: none;
        font-weight: 600;
        z-index: 10001;
        border-radius: 0 0 4px 0;
      }
      .skip-link:focus {
        top: 0;
        outline: 3px solid #f59e0b;
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);
  }

  // Melhorar atributos ARIA
  melhorarARIA() {
    // Main content
    const main = document.getElementById('main-content');
    if (main) {
      main.setAttribute('role', 'main');
      main.setAttribute('aria-label', 'Conteúdo principal da apostila');
    }

    // Sidebar
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.setAttribute('role', 'navigation');
      sidebar.setAttribute('aria-label', 'Menu de navegação principal');
    }

    // Botões de toggle
    document.querySelectorAll('.toggle-btn').forEach(btn => {
      const target = btn.dataset.target;
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      
      btn.setAttribute('aria-controls', target);
      btn.setAttribute('aria-label', 
        expanded ? `Recolher seção ${target}` : `Expandir seção ${target}`
      );

      // Atualizar ao clicar
      btn.addEventListener('click', () => {
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !isExpanded);
        btn.setAttribute('aria-label', 
          !isExpanded ? `Recolher seção ${target}` : `Expandir seção ${target}`
        );
      });
    });

    // Seções colapsáveis
    document.querySelectorAll('.sec-content').forEach(section => {
      section.setAttribute('role', 'region');
      section.setAttribute('aria-live', 'polite');
    });

    // Formulários
    document.querySelectorAll('input, textarea, select').forEach(input => {
      if (!input.getAttribute('aria-label') && !input.id) {
        const label = input.closest('label')?.textContent || 
                     input.placeholder || 
                     'Campo de entrada';
        input.setAttribute('aria-label', label);
      }
    });

    // Imagens
    document.querySelectorAll('img:not([alt])').forEach(img => {
      img.setAttribute('alt', 'Imagem decorativa');
      img.setAttribute('role', 'presentation');
    });

    // Links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      if (!link.getAttribute('aria-label')) {
        link.setAttribute('aria-label', `Navegar para ${link.textContent}`);
      }
    });
  }

  // Navegação por teclado
  navegacaoTeclado() {
    // Atalhos globais
    document.addEventListener('keydown', (e) => {
      // Alt + M: Menu
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        document.getElementById('mobile-menu-btn')?.click();
        this.anunciar('Menu aberto');
      }

      // Alt + S: Busca
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        const search = document.getElementById('search-input');
        search?.focus();
        this.anunciar('Campo de busca focado');
      }

      // Alt + T: Tema
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        document.getElementById('tgl')?.click();
        this.anunciar('Tema alternado');
      }

      // Alt + H: Ajuda de atalhos
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        this.mostrarAjudaAtalhos();
      }

      // Escape: Fechar modais
      if (e.key === 'Escape') {
        document.querySelectorAll('[role="dialog"]').forEach(modal => {
          if (modal.style.display !== 'none') {
            modal.style.display = 'none';
            this.anunciar('Modal fechado');
          }
        });
      }
    });

    // Navegação entre seções com Tab melhorada
    document.querySelectorAll('section[id]').forEach((section, index, sections) => {
      section.setAttribute('tabindex', '-1');
      
      // Adicionar navegação com setas
      section.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' && index < sections.length - 1) {
          e.preventDefault();
          sections[index + 1].focus();
          sections[index + 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (e.key === 'ArrowUp' && index > 0) {
          e.preventDefault();
          sections[index - 1].focus();
          sections[index - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Trap focus em modais
    this.implementarFocusTrap();
  }

  // Implementar focus trap em modais
  implementarFocusTrap() {
    document.addEventListener('focusin', (e) => {
      const modal = e.target.closest('[role="dialog"]');
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Se Tab no último elemento, volta pro primeiro
      if (e.target === lastElement && !e.shiftKey) {
        firstElement.focus();
        e.preventDefault();
      }

      // Se Shift+Tab no primeiro, vai pro último
      if (e.target === firstElement && e.shiftKey) {
        lastElement.focus();
        e.preventDefault();
      }
    });
  }

  // Anúncios para leitores de tela
  anunciosLeitores() {
    // Criar região de anúncios
    const liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(liveRegion);

    // Anunciar mudanças de progresso
    const progressBar = document.getElementById('sidebar-progress');
    if (progressBar) {
      const observer = new MutationObserver(() => {
        const progresso = progressBar.style.width;
        this.anunciar(`Progresso de leitura: ${progresso}`);
      });
      observer.observe(progressBar, { attributes: true, attributeFilter: ['style'] });
    }
  }

  // Anunciar mensagem
  anunciar(mensagem, prioridade = 'polite') {
    const liveRegion = document.getElementById('aria-live-region');
    if (!liveRegion) return;

    liveRegion.setAttribute('aria-live', prioridade);
    liveRegion.textContent = mensagem;

    // Limpar após 3 segundos
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 3000);
  }

  // Modo alto contraste
  modoAltoContraste() {
    const btn = document.createElement('button');
    btn.id = 'toggle-contrast';
    btn.className = 'accessibility-btn';
    btn.setAttribute('aria-label', 'Alternar modo alto contraste');
    btn.innerHTML = '◐';
    btn.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #1a202c;
      color: white;
      border: 2px solid #f59e0b;
      font-size: 24px;
      cursor: pointer;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: transform 0.2s;
    `;

    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.1)';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
    });

    btn.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      const ativo = document.body.classList.contains('high-contrast');
      this.anunciar(ativo ? 'Modo alto contraste ativado' : 'Modo alto contraste desativado');
      localStorage.setItem('high-contrast', ativo);
    });

    document.body.appendChild(btn);

    // Restaurar preferência
    if (localStorage.getItem('high-contrast') === 'true') {
      document.body.classList.add('high-contrast');
    }

    // CSS para alto contraste
    const style = document.createElement('style');
    style.textContent = `
      body.high-contrast {
        filter: contrast(1.5) !important;
      }
      body.high-contrast * {
        border-color: #000 !important;
      }
      body.high-contrast a {
        text-decoration: underline !important;
        font-weight: 700 !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Ajustar tamanho de fontes
  ajustarFontes() {
    const container = document.createElement('div');
    container.className = 'font-controls';
    container.style.cssText = `
      position: fixed;
      bottom: 160px;
      right: 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      z-index: 1000;
    `;

    const btnMaior = this.criarBotaoFonte('A+', 'Aumentar fonte', () => {
      this.ajustarTamanhoFonte(1.1);
    });

    const btnMenor = this.criarBotaoFonte('A-', 'Diminuir fonte', () => {
      this.ajustarTamanhoFonte(0.9);
    });

    const btnReset = this.criarBotaoFonte('A', 'Resetar fonte', () => {
      document.documentElement.style.fontSize = '16px';
      localStorage.removeItem('font-size');
      this.anunciar('Tamanho de fonte resetado');
    });

    container.appendChild(btnMaior);
    container.appendChild(btnMenor);
    container.appendChild(btnReset);
    document.body.appendChild(container);

    // Restaurar preferência
    const savedSize = localStorage.getItem('font-size');
    if (savedSize) {
      document.documentElement.style.fontSize = savedSize;
    }
  }

  criarBotaoFonte(texto, label, onClick) {
    const btn = document.createElement('button');
    btn.textContent = texto;
    btn.setAttribute('aria-label', label);
    btn.style.cssText = `
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #1a202c;
      color: white;
      border: 2px solid #f59e0b;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: transform 0.2s;
    `;

    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.1)';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
    });

    btn.addEventListener('click', onClick);
    return btn;
  }

  ajustarTamanhoFonte(fator) {
    const currentSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    const newSize = currentSize * fator;

    if (newSize < 12 || newSize > 24) {
      this.anunciar('Limite de tamanho de fonte atingido');
      return;
    }

    document.documentElement.style.fontSize = newSize + 'px';
    localStorage.setItem('font-size', newSize + 'px');
    this.anunciar(`Fonte ajustada para ${Math.round(newSize)}px`);
  }

  // Mostrar ajuda de atalhos
  mostrarAjudaAtalhos() {
    const modal = document.createElement('div');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'shortcuts-title');
    modal.setAttribute('aria-modal', 'true');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;

    modal.innerHTML = `
      <div style="
        background: white;
        border-radius: 16px;
        padding: 30px;
        max-width: 500px;
        width: 100%;
      ">
        <h2 id="shortcuts-title" style="font-size: 24px; font-weight: 800; margin-bottom: 20px;">
          ⌨️ Atalhos de Teclado
        </h2>
        <div style="display: grid; gap: 12px;">
          <div style="display: flex; justify-content: space-between; padding: 10px; background: #f3f4f6; border-radius: 8px;">
            <span>Abrir menu</span>
            <kbd style="background: #1a202c; color: white; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Alt + M</kbd>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 10px; background: #f3f4f6; border-radius: 8px;">
            <span>Buscar</span>
            <kbd style="background: #1a202c; color: white; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Alt + S</kbd>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 10px; background: #f3f4f6; border-radius: 8px;">
            <span>Alternar tema</span>
            <kbd style="background: #1a202c; color: white; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Alt + T</kbd>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 10px; background: #f3f4f6; border-radius: 8px;">
            <span>Esta ajuda</span>
            <kbd style="background: #1a202c; color: white; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Alt + H</kbd>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 10px; background: #f3f4f6; border-radius: 8px;">
            <span>Fechar modal</span>
            <kbd style="background: #1a202c; color: white; padding: 4px 8px; border-radius: 4px; font-family: monospace;">Esc</kbd>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 10px; background: #f3f4f6; border-radius: 8px;">
            <span>Navegar seções</span>
            <kbd style="background: #1a202c; color: white; padding: 4px 8px; border-radius: 4px; font-family: monospace;">↑ ↓</kbd>
          </div>
        </div>
        <button onclick="this.closest('[role=dialog]').remove()" style="
          width: 100%;
          margin-top: 20px;
          background: #6366f1;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        ">Fechar</button>
      </div>
    `;

    document.body.appendChild(modal);
    modal.querySelector('button').focus();
    this.anunciar('Ajuda de atalhos aberta');
  }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  window.accessibilityManager = new AccessibilityManager();
});
