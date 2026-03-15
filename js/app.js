/**
 * Arquivo Principal - Integração de Todos os Módulos
 * Apostila JavaScript Premium v1.0.0
 */

// Importar módulos (usar type="module" no HTML)
import { sanitizeHTML, sanitizeText, createSafeElement } from './sanitize.js';
import { SecurePlayground } from './playground.js';
import { ProgressManager } from './progress-manager.js';
import { NotesSystem } from './notes-system.js';
import { LocalAnalytics } from './analytics.js';
import { AccessibilityManager } from './accessibility.js';

class ApostilaApp {
  constructor() {
    this.init();
  }

  async init() {
    console.log('🚀 Inicializando Apostila JavaScript Premium...');

    // Registrar Service Worker (PWA)
    if ('serviceWorker' in navigator) {
      try {
        const swPath = (window.APP_CONFIG && window.APP_CONFIG.getAssetPath)
          ? window.APP_CONFIG.getAssetPath('/sw.js')
          : './sw.js';
        const registration = await navigator.serviceWorker.register(swPath);
        console.log('✓ Service Worker registrado:', registration.scope);
        
        // Verificar atualizações
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.notificarAtualizacao();
            }
          });
        });
      } catch (err) {
        console.warn('Service Worker falhou:', err);
      }
    }

    // Inicializar módulos
    this.progressManager = new ProgressManager();
    this.notesSystem = new NotesSystem();
    this.analytics = new LocalAnalytics();
    this.accessibility = new AccessibilityManager();

    // Internacionalização (i18n)
    this.setupI18n();

    // Configurar UI
    this.setupUI();
    this.setupTheme();
    this.setupNavigation();
    this.setupSearch();
    this.setupProgress();
    this.setupFavorites();
    this.setupCopyButtons();
    this.setupQuizzes();
    this.setupPlaygrounds();
    this.setupChatbot();
    this.setupPrint();
    this.setupOfflineDetection();

    console.log('✓ Apostila carregada com sucesso!');
  }

  // Internacionalização (i18n)
  setupI18n() {
    this.langKey = 'apostila_lang';
    this.defaultLang = 'pt-BR';
    this.lang = localStorage.getItem(this.langKey) || this.defaultLang;

    this.translations = {
      'pt-BR': {
        print: 'Imprimir/PDF',
        expandAll: 'Expandir tudo',
        collapseAll: 'Recolher tudo',
        searchPlaceholder: 'Buscar capítulo...',
        skipContent: 'Saltar para conteúdo',
        langSelectAria: 'Selecionar idioma',
        help: 'Ajuda',
        connected: 'Online',
        disconnected: 'Offline',
      },
      en: {
        print: 'Print/PDF',
        expandAll: 'Expand all',
        collapseAll: 'Collapse all',
        searchPlaceholder: 'Search chapter...',
        skipContent: 'Skip to content',
        langSelectAria: 'Select language',
        help: 'Help',
        connected: 'Online',
        disconnected: 'Offline',
      },
    };

    const select = document.getElementById('lang-select');
    if (select) {
      select.value = this.lang;
      select.addEventListener('change', (evt) => {
        const value = evt.target.value;
        this.setLang(value);
      });
    }

    this.applyTranslations();
  }

  t(key) {
    return this.translations[this.lang]?.[key] || this.translations[this.defaultLang]?.[key] || key;
  }

  setLang(lang) {
    if (!this.translations[lang]) return;
    this.lang = lang;
    localStorage.setItem(this.langKey, lang);
    this.applyTranslations();
  }

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (!key) return;
      el.textContent = this.t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      if (!key) return;
      el.placeholder = this.t(key);
    });

    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.dataset.i18nTitle;
      if (!key) return;
      el.title = this.t(key);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.dataset.i18nAria;
      if (!key) return;
      el.setAttribute('aria-label', this.t(key));
    });

    // Skip-link text
    const skipLink = document.querySelector('a[href="#main-content"]');
    if (skipLink) skipLink.textContent = this.t('skipContent');

    // Update toggle buttons (expand/collapse) text values
    document.querySelectorAll('.toggle-btn').forEach(btn => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.textContent = expanded ? `▾ ${this.t('collapseAll')}` : `▸ ${this.t('expandAll')}`;
    });
  }

  // Configurar interface
  setupUI() {
    // Data atual na capa
    const dataAtual = document.getElementById('data-atual');
    if (dataAtual) {
      dataAtual.textContent = new Date().toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    // Botões de expandir/recolher tudo
    document.getElementById('expand-all')?.addEventListener('click', () => {
      document.querySelectorAll('.sec-content').forEach(sec => {
        sec.style.maxHeight = 'none';
        sec.classList.remove('collapsed');
      });
      document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.textContent = `▾ ${this.t('collapseAll')}`;
        btn.setAttribute('aria-expanded', 'true');
      });
    });

    document.getElementById('collapse-all')?.addEventListener('click', () => {
      document.querySelectorAll('.sec-content').forEach(sec => {
        sec.style.maxHeight = '0';
        sec.classList.add('collapsed');
      });
      document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.textContent = `▸ ${this.t('expandAll')}`;
        btn.setAttribute('aria-expanded', 'false');
      });
    });

    // Toggle de seções individuais
    document.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const target = document.getElementById(targetId);
        if (!target) return;

        const isCollapsed = target.classList.contains('collapsed');
        
        if (isCollapsed) {
          target.style.maxHeight = 'none';
          target.classList.remove('collapsed');
          btn.textContent = `▾ ${this.t('collapseAll')}`;
          btn.setAttribute('aria-expanded', 'true');
        } else {
          target.style.maxHeight = '0';
          target.classList.add('collapsed');
          btn.textContent = `▸ ${this.t('expandAll')}`;
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Menu mobile
    const menuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    menuBtn?.addEventListener('click', () => {
      sidebar?.classList.toggle('-translate-x-full');
      overlay?.classList.toggle('hidden');
    });

    overlay?.addEventListener('click', () => {
      sidebar?.classList.add('-translate-x-full');
      overlay?.classList.add('hidden');
    });

    // Botão de colapsar desktop
    document.getElementById('desktop-collapse-btn')?.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-collapsed');
    });

    // Voltar ao topo
    const backTop = document.getElementById('back-top');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backTop?.classList.remove('opacity-0', 'pointer-events-none');
      } else {
        backTop?.classList.add('opacity-0', 'pointer-events-none');
      }
    });

    backTop?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Tema claro/escuro
  setupTheme() {
    const toggle = document.getElementById('tgl');
    const html = document.documentElement;

    // Restaurar preferência
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      html.classList.add('light');
    }

    toggle?.addEventListener('click', () => {
      html.classList.toggle('light');
      const isLight = html.classList.contains('light');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }

  // Navegação e scrollspy
  setupNavigation() {
    const navList = document.getElementById('nav-list');
    if (!navList) return;

    // Gerar menu automaticamente
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      const id = section.id;
      if (id === 'capa') return;

      const title = section.querySelector('h2')?.textContent || id;
      const link = document.createElement('a');
      link.href = `#${id}`;
      link.textContent = title;
      link.className = 'block px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors text-sm';
      
      link.addEventListener('click', (e) => {
        e.preventDefault();
        section.scrollIntoView({ behavior: 'smooth' });
        
        // Fechar menu mobile
        document.getElementById('sidebar')?.classList.add('-translate-x-full');
        document.getElementById('overlay')?.classList.add('hidden');
      });

      navList.appendChild(link);
    });

    // Scrollspy - destacar seção ativa
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          document.querySelectorAll('#nav-list a').forEach(link => {
            link.classList.remove('nav-active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('nav-active');
            }
          });
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));
  }

  // Busca
  setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const termo = e.target.value.toLowerCase().trim();
      
      document.querySelectorAll('#nav-list a').forEach(link => {
        const texto = link.textContent.toLowerCase();
        if (texto.includes(termo) || termo === '') {
          link.style.display = 'block';
        } else {
          link.style.display = 'none';
        }
      });
    });
  }

  // Barra de progresso
  setupProgress() {
    const progressBar = document.getElementById('progress-bar');
    const sidebarProgress = document.getElementById('sidebar-progress');
    const scrollPct = document.getElementById('scroll-pct');

    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;

      if (progressBar) progressBar.style.width = scrolled + '%';
      if (sidebarProgress) sidebarProgress.style.width = scrolled + '%';
      if (scrollPct) scrollPct.textContent = Math.round(scrolled) + '%';

      // Salvar progresso
      localStorage.setItem('progresso_leitura', scrolled);
    });

    // Restaurar posição
    const savedProgress = localStorage.getItem('progresso_leitura');
    if (savedProgress && window.location.hash === '') {
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      window.scrollTo(0, (parseFloat(savedProgress) / 100) * height);
    }
  }

  // Sistema de favoritos
  setupFavorites() {
    const favList = document.getElementById('fav-list');
    const favSidebar = document.getElementById('fav-sidebar');
    let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');

    // Adicionar botões de favoritar
    document.querySelectorAll('section[id] h2').forEach(h2 => {
      const section = h2.closest('section');
      const id = section?.id;
      if (!id || id === 'capa' || id === 'ementa') return;

      const btn = document.createElement('button');
      btn.className = 'fav-btn no-print';
      btn.innerHTML = favoritos.includes(id) ? '⭐' : '☆';
      btn.title = 'Favoritar';
      
      btn.addEventListener('click', () => {
        if (favoritos.includes(id)) {
          favoritos = favoritos.filter(f => f !== id);
          btn.innerHTML = '☆';
        } else {
          favoritos.push(id);
          btn.innerHTML = '⭐';
        }
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        this.atualizarFavoritos();
      });

      h2.appendChild(btn);
    });

    this.atualizarFavoritos();
  }

  atualizarFavoritos() {
    const favList = document.getElementById('fav-list');
    const favSidebar = document.getElementById('fav-sidebar');
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');

    if (!favList) return;

    favList.innerHTML = '';
    
    if (favoritos.length === 0) {
      favSidebar.style.display = 'none';
      return;
    }

    favSidebar.style.display = 'block';

    favoritos.forEach(id => {
      const section = document.getElementById(id);
      const title = section?.querySelector('h2')?.textContent || id;
      
      const link = document.createElement('a');
      link.href = `#${id}`;
      link.textContent = title;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        section?.scrollIntoView({ behavior: 'smooth' });
      });
      
      favList.appendChild(link);
    });
  }

  // Botões de copiar código
  setupCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const pre = btn.closest('pre');
        const code = pre?.textContent.replace('Copiar', '').trim();
        
        if (!code) return;

        try {
          await navigator.clipboard.writeText(code);
          btn.textContent = '✓ Copiado!';
          setTimeout(() => {
            btn.textContent = 'Copiar';
          }, 2000);
        } catch (err) {
          btn.textContent = '✗ Erro';
          setTimeout(() => {
            btn.textContent = 'Copiar';
          }, 2000);
        }
      });
    });
  }

  // Sistema de quiz
  setupQuizzes() {
    document.querySelectorAll('.quiz-wrap').forEach(quiz => {
      const questions = quiz.querySelectorAll('.quiz-q');
      let score = 0;
      let answered = 0;

      questions.forEach(q => {
        const options = q.querySelectorAll('.quiz-opt');
        options.forEach(opt => {
          opt.addEventListener('click', function() {
            if (this.classList.contains('correct') || this.classList.contains('wrong')) {
              return; // Já respondida
            }

            const isCorrect = this.dataset.correct === 'true';
            this.classList.add(isCorrect ? 'correct' : 'wrong');
            
            if (isCorrect) score++;
            answered++;

            // Desabilitar outras opções
            options.forEach(o => o.style.pointerEvents = 'none');

            // Mostrar resultado final
            if (answered === questions.length) {
              const scoreDiv = quiz.querySelector('.quiz-score');
              if (scoreDiv) {
                const pct = Math.round((score / questions.length) * 100);
                scoreDiv.textContent = `Resultado: ${score}/${questions.length} (${pct}%)`;
                scoreDiv.style.display = 'block';
                scoreDiv.style.background = pct >= 70 ? '#dcfce7' : '#fee2e2';
                scoreDiv.style.color = pct >= 70 ? '#15803d' : '#b91c1c';
              }
            }
          });
        });
      });
    });
  }

  // Playgrounds de código
  setupPlaygrounds() {
    // Já inicializado pelo módulo playground.js
    console.log('✓ Playgrounds configurados');
  }

  // Chatbot (placeholder)
  setupChatbot() {
    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');

    chatBubble?.addEventListener('click', () => {
      if (chatWindow) {
        chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
      }
    });
  }

  // Otimizar impressão
  setupPrint() {
    window.addEventListener('beforeprint', () => {
      // Expandir todas as seções antes de imprimir
      document.querySelectorAll('.sec-content').forEach(sec => {
        sec.style.maxHeight = 'none';
        sec.classList.remove('collapsed');
      });
    });
  }

  // Detectar offline/online
  setupOfflineDetection() {
    window.addEventListener('offline', () => {
      this.mostrarToast('⚠️ Você está offline. Conteúdo salvo disponível.', 'warning');
    });

    window.addEventListener('online', () => {
      this.mostrarToast('✓ Conexão restaurada!', 'success');
    });
  }

  // Notificar atualização disponível
  notificarAtualizacao() {
    const banner = document.createElement('div');
    banner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #6366f1;
      color: white;
      padding: 15px;
      text-align: center;
      z-index: 10000;
      font-weight: 600;
    `;
    banner.innerHTML = `
      🎉 Nova versão disponível! 
      <button onclick="window.location.reload()" style="
        background: white;
        color: #6366f1;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        margin-left: 10px;
        font-weight: 700;
        cursor: pointer;
      ">Atualizar Agora</button>
    `;
    document.body.appendChild(banner);
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
    `;

    const cores = {
      success: 'background: #10b981; color: white;',
      error: 'background: #ef4444; color: white;',
      info: 'background: #3b82f6; color: white;',
      warning: 'background: #f59e0b; color: white;'
    };

    toast.style.cssText += cores[tipo] || cores.info;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
  }
}

// Inicializar aplicação
function initApp() {
  try {
    window.apostilaApp = new ApostilaApp();
  } catch (err) {
    console.error('Falha ao iniciar a Apostila:', err);
    // Mostrar erro visível para que seja fácil relatar
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:15000;padding:24px;text-align:center;font-family:sans-serif;';
    overlay.innerHTML = `
      <div style="max-width:680px;">
        <h1 style="font-size:1.8rem;margin-bottom:16px;">Erro ao iniciar a aplicação</h1>
        <pre style="white-space:pre-wrap;word-break:break-word;background:rgba(255,255,255,0.08);padding:16px;border-radius:12px;max-height:320px;overflow:auto;">${String(err)}</pre>
        <p style="margin-top:16px;color:rgba(255,255,255,0.7)">Abra o console para ver detalhes adicionais.</p>
      </div>
    `;
    document.body.appendChild(overlay);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Exportar para uso global
export default ApostilaApp;
