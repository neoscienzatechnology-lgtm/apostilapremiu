/**
 * Sistema de Analytics Local
 * Rastreia comportamento do usuário sem enviar dados externos
 */

export class LocalAnalytics {
  constructor() {
    this.storageKey = 'analytics_local';
    this.sessionKey = 'session_atual';
    this.eventos = this.carregarEventos();
    this.sessao = this.iniciarSessao();
    this.init();
  }

  init() {
    this.rastrearNavegacao();
    this.rastrearTempo();
    this.rastrearInteracoes();
    this.rastrearProgresso();
  }

  // Iniciar sessão
  iniciarSessao() {
    const sessaoAtual = sessionStorage.getItem(this.sessionKey);
    
    if (sessaoAtual) {
      return JSON.parse(sessaoAtual);
    }

    const novaSessao = {
      id: this.gerarId(),
      inicio: Date.now(),
      paginasVisitadas: [],
      interacoes: 0,
      tempoTotal: 0
    };

    sessionStorage.setItem(this.sessionKey, JSON.stringify(novaSessao));
    return novaSessao;
  }

  // Registrar evento
  registrar(categoria, acao, label = '', valor = 0) {
    const evento = {
      id: this.gerarId(),
      timestamp: Date.now(),
      sessaoId: this.sessao.id,
      categoria,
      acao,
      label,
      valor,
      pagina: window.location.pathname,
      dispositivo: this.getDispositivo()
    };

    this.eventos.push(evento);
    this.salvarEventos();

    // Limitar a 1000 eventos (GDPR-friendly)
    if (this.eventos.length > 1000) {
      this.eventos = this.eventos.slice(-1000);
      this.salvarEventos();
    }
  }

  // Rastrear navegação entre seções
  rastrearNavegacao() {
    // Observar mudanças de hash (navegação interna)
    window.addEventListener('hashchange', () => {
      const secao = window.location.hash.slice(1);
      if (secao) {
        this.registrar('navegacao', 'secao_visitada', secao);
        this.sessao.paginasVisitadas.push({
          secao,
          timestamp: Date.now()
        });
        this.atualizarSessao();
      }
    });

    // Rastrear cliques em links internos
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        const destino = link.getAttribute('href').slice(1);
        this.registrar('navegacao', 'link_interno', destino);
      }
    });
  }

  // Rastrear tempo de leitura
  rastrearTempo() {
    let tempoInicio = Date.now();
    let secaoAtual = null;

    // Intersection Observer para detectar seção visível
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const novaSecao = entry.target.id;
          
          if (secaoAtual && secaoAtual !== novaSecao) {
            const tempoLeitura = Math.round((Date.now() - tempoInicio) / 1000);
            this.registrar('tempo', 'leitura_secao', secaoAtual, tempoLeitura);
          }

          secaoAtual = novaSecao;
          tempoInicio = Date.now();
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });

    // Salvar tempo total ao sair
    window.addEventListener('beforeunload', () => {
      if (secaoAtual) {
        const tempoLeitura = Math.round((Date.now() - tempoInicio) / 1000);
        this.registrar('tempo', 'leitura_secao', secaoAtual, tempoLeitura);
      }
      
      this.sessao.tempoTotal = Date.now() - this.sessao.inicio;
      this.atualizarSessao();
    });
  }

  // Rastrear interações
  rastrearInteracoes() {
    // Botões de toggle
    document.addEventListener('click', (e) => {
      if (e.target.closest('.toggle-btn')) {
        this.registrar('interacao', 'toggle_secao', e.target.dataset.target);
        this.sessao.interacoes++;
        this.atualizarSessao();
      }

      // Botões de copiar código
      if (e.target.closest('.copy-btn')) {
        this.registrar('interacao', 'copiar_codigo');
        this.sessao.interacoes++;
        this.atualizarSessao();
      }

      // Favoritos
      if (e.target.closest('.fav-btn')) {
        this.registrar('interacao', 'favoritar');
        this.sessao.interacoes++;
        this.atualizarSessao();
      }

      // Playground
      if (e.target.closest('.pg-run')) {
        this.registrar('interacao', 'executar_codigo');
        this.sessao.interacoes++;
        this.atualizarSessao();
      }

      // Quiz
      if (e.target.closest('.quiz-opt')) {
        this.registrar('interacao', 'responder_quiz');
        this.sessao.interacoes++;
        this.atualizarSessao();
      }
    });

    // Busca
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      let timeoutBusca;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(timeoutBusca);
        timeoutBusca = setTimeout(() => {
          if (e.target.value.length > 2) {
            this.registrar('busca', 'termo_pesquisado', e.target.value);
          }
        }, 1000);
      });
    }
  }

  // Rastrear progresso
  rastrearProgresso() {
    // Checklist
    document.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox' && e.target.id?.startsWith('chk')) {
        this.registrar('progresso', 'checklist_marcado', e.target.id, e.target.checked ? 1 : 0);
      }
    });
  }

  // Gerar relatório
  gerarRelatorio() {
    const agora = Date.now();
    const ultimos7Dias = agora - (7 * 24 * 60 * 60 * 1000);
    const eventosRecentes = this.eventos.filter(e => e.timestamp > ultimos7Dias);

    const relatorio = {
      periodo: '7 dias',
      totalEventos: eventosRecentes.length,
      totalSessoes: new Set(eventosRecentes.map(e => e.sessaoId)).size,
      
      // Seções mais visitadas
      secoesPopulares: this.contarPorLabel(
        eventosRecentes.filter(e => e.categoria === 'navegacao' && e.acao === 'secao_visitada')
      ),

      // Tempo médio de leitura por seção
      tempoMedioPorSecao: this.calcularTempoMedio(
        eventosRecentes.filter(e => e.categoria === 'tempo' && e.acao === 'leitura_secao')
      ),

      // Interações mais comuns
      interacoesPopulares: this.contarPorAcao(
        eventosRecentes.filter(e => e.categoria === 'interacao')
      ),

      // Termos de busca
      buscasComuns: this.contarPorLabel(
        eventosRecentes.filter(e => e.categoria === 'busca')
      ),

      // Dispositivos
      dispositivos: this.contarPorDispositivo(eventosRecentes),

      // Horários de pico
      horariosPico: this.analisarHorarios(eventosRecentes)
    };

    return relatorio;
  }

  // Exibir dashboard
  exibirDashboard() {
    const relatorio = this.gerarRelatorio();
    
    const modal = document.createElement('div');
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
        border-radius: 20px;
        padding: 30px;
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
          <h2 style="font-size: 24px; font-weight: 800; color: #1a202c; margin: 0;">
            📊 Seu Progresso (${relatorio.periodo})
          </h2>
          <button onclick="this.closest('div[style*=fixed]').remove()" style="
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #6b7280;
          ">×</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px;">
          <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 20px; border-radius: 12px; color: white;">
            <div style="font-size: 32px; font-weight: 800;">${relatorio.totalEventos}</div>
            <div style="font-size: 14px; opacity: 0.9;">Total de Ações</div>
          </div>
          <div style="background: linear-gradient(135deg, #f093fb, #f5576c); padding: 20px; border-radius: 12px; color: white;">
            <div style="font-size: 32px; font-weight: 800;">${relatorio.totalSessoes}</div>
            <div style="font-size: 14px; opacity: 0.9;">Sessões de Estudo</div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 10px; color: #1a202c;">
            🔥 Seções Mais Visitadas
          </h3>
          ${this.renderizarLista(relatorio.secoesPopulares)}
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 10px; color: #1a202c;">
            ⏱️ Tempo Médio de Leitura
          </h3>
          ${this.renderizarTempos(relatorio.tempoMedioPorSecao)}
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 10px; color: #1a202c;">
            💡 Interações Populares
          </h3>
          ${this.renderizarLista(relatorio.interacoesPopulares)}
        </div>

        <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
          <button onclick="window.localAnalytics.exportarDados()" style="
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            margin-right: 10px;
          ">📥 Exportar Dados</button>
          
          <button onclick="if(confirm('Limpar todos os dados de analytics?')) window.localAnalytics.limparDados()" style="
            background: #ef4444;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
          ">🗑️ Limpar Dados</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  // Helpers de renderização
  renderizarLista(dados) {
    if (!dados || dados.length === 0) {
      return '<p style="color: #6b7280; font-size: 14px;">Nenhum dado disponível</p>';
    }

    return dados.slice(0, 5).map((item, i) => `
      <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: ${i % 2 === 0 ? '#f9fafb' : 'white'}; border-radius: 6px; margin-bottom: 4px;">
        <span style="font-size: 14px; color: #374151;">${item.label || item.acao}</span>
        <span style="font-weight: 600; color: #6366f1;">${item.count}</span>
      </div>
    `).join('');
  }

  renderizarTempos(dados) {
    if (!dados || Object.keys(dados).length === 0) {
      return '<p style="color: #6b7280; font-size: 14px;">Nenhum dado disponível</p>';
    }

    return Object.entries(dados).slice(0, 5).map(([secao, tempo], i) => `
      <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: ${i % 2 === 0 ? '#f9fafb' : 'white'}; border-radius: 6px; margin-bottom: 4px;">
        <span style="font-size: 14px; color: #374151;">${secao}</span>
        <span style="font-weight: 600; color: #10b981;">${Math.round(tempo)}s</span>
      </div>
    `).join('');
  }

  // Métodos auxiliares
  contarPorLabel(eventos) {
    const contagem = {};
    eventos.forEach(e => {
      contagem[e.label] = (contagem[e.label] || 0) + 1;
    });
    return Object.entries(contagem)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }

  contarPorAcao(eventos) {
    const contagem = {};
    eventos.forEach(e => {
      contagem[e.acao] = (contagem[e.acao] || 0) + 1;
    });
    return Object.entries(contagem)
      .map(([acao, count]) => ({ acao, count }))
      .sort((a, b) => b.count - a.count);
  }

  calcularTempoMedio(eventos) {
    const tempos = {};
    const contagens = {};

    eventos.forEach(e => {
      if (!tempos[e.label]) {
        tempos[e.label] = 0;
        contagens[e.label] = 0;
      }
      tempos[e.label] += e.valor;
      contagens[e.label]++;
    });

    const medias = {};
    Object.keys(tempos).forEach(label => {
      medias[label] = tempos[label] / contagens[label];
    });

    return medias;
  }

  contarPorDispositivo(eventos) {
    const contagem = {};
    eventos.forEach(e => {
      contagem[e.dispositivo] = (contagem[e.dispositivo] || 0) + 1;
    });
    return contagem;
  }

  analisarHorarios(eventos) {
    const horas = new Array(24).fill(0);
    eventos.forEach(e => {
      const hora = new Date(e.timestamp).getHours();
      horas[hora]++;
    });
    return horas;
  }

  // Exportar dados
  exportarDados() {
    const relatorio = this.gerarRelatorio();
    const json = JSON.stringify(relatorio, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Limpar dados
  limparDados() {
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.sessionKey);
    this.eventos = [];
    alert('✓ Dados de analytics limpos!');
    window.location.reload();
  }

  // Utilitários
  carregarEventos() {
    const dados = localStorage.getItem(this.storageKey);
    return dados ? JSON.parse(dados) : [];
  }

  salvarEventos() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.eventos));
  }

  atualizarSessao() {
    sessionStorage.setItem(this.sessionKey, JSON.stringify(this.sessao));
  }

  gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getDispositivo() {
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return 'mobile';
    if (/tablet/i.test(ua)) return 'tablet';
    return 'desktop';
  }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  window.localAnalytics = new LocalAnalytics();
});
