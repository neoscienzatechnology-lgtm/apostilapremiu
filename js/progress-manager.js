/**
 * Sistema de Backup e Restauração de Progresso
 */

export class ProgressManager {
  constructor() {
    this.storageKeys = [
      'checklist_js',
      'favoritos',
      'progresso_leitura',
      'notas_pessoais',
      'preferencias_usuario',
      'historico_navegacao'
    ];
  }

  // Exportar todo o progresso
  exportarProgresso() {
    const dados = {
      versao: '1.0.0',
      dataExportacao: new Date().toISOString(),
      usuario: this.getInfoUsuario(),
      progresso: {}
    };

    this.storageKeys.forEach(key => {
      const valor = localStorage.getItem(key);
      if (valor) {
        try {
          dados.progresso[key] = JSON.parse(valor);
        } catch {
          dados.progresso[key] = valor;
        }
      }
    });

    // Estatísticas
    dados.estatisticas = this.calcularEstatisticas(dados.progresso);

    return dados;
  }

  // Baixar arquivo JSON
  baixarProgresso() {
    const dados = this.exportarProgresso();
    const json = JSON.stringify(dados, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `apostila-progresso-${this.formatarData()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.notificar('✓ Progresso exportado com sucesso!', 'success');
  }

  // Importar progresso de arquivo
  async importarProgresso(arquivo) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const dados = JSON.parse(e.target.result);
          
          // Validar estrutura
          if (!dados.versao || !dados.progresso) {
            throw new Error('Arquivo inválido');
          }

          // Confirmar sobrescrita
          if (!confirm('⚠️ Isso irá sobrescrever seu progresso atual. Deseja continuar?')) {
            reject(new Error('Importação cancelada'));
            return;
          }

          // Restaurar dados
          Object.entries(dados.progresso).forEach(([key, valor]) => {
            localStorage.setItem(key, JSON.stringify(valor));
          });

          this.notificar('✓ Progresso importado com sucesso!', 'success');
          
          // Recarregar página
          setTimeout(() => window.location.reload(), 1500);
          resolve(dados);
          
        } catch (err) {
          this.notificar('✗ Erro ao importar: ' + err.message, 'error');
          reject(err);
        }
      };

      reader.onerror = () => {
        this.notificar('✗ Erro ao ler arquivo', 'error');
        reject(new Error('Erro ao ler arquivo'));
      };

      reader.readAsText(arquivo);
    });
  }

  // Sincronizar com nuvem (placeholder para futura implementação)
  async sincronizarNuvem() {
    const dados = this.exportarProgresso();
    
    // TODO: Implementar sincronização com backend
    console.log('Sincronizando com nuvem...', dados);
    
    this.notificar('🔄 Sincronização em desenvolvimento', 'info');
  }

  // Limpar todo o progresso
  limparProgresso() {
    if (!confirm('⚠️ ATENÇÃO: Isso irá apagar TODO o seu progresso. Tem certeza?')) {
      return;
    }

    if (!confirm('🚨 ÚLTIMA CHANCE: Você exportou seu progresso? Esta ação é IRREVERSÍVEL!')) {
      return;
    }

    this.storageKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    this.notificar('✓ Progresso limpo', 'success');
    setTimeout(() => window.location.reload(), 1000);
  }

  // Calcular estatísticas
  calcularEstatisticas(progresso) {
    const stats = {
      totalCapitulos: 0,
      capitulosCompletos: 0,
      percentualConclusao: 0,
      totalFavoritos: 0,
      totalNotas: 0,
      tempoEstimado: 0
    };

    // Checklist
    if (progresso.checklist_js) {
      const checklist = progresso.checklist_js;
      stats.totalCapitulos = Object.keys(checklist).length;
      stats.capitulosCompletos = Object.values(checklist).filter(v => v).length;
      stats.percentualConclusao = Math.round(
        (stats.capitulosCompletos / stats.totalCapitulos) * 100
      );
    }

    // Favoritos
    if (progresso.favoritos) {
      stats.totalFavoritos = Array.isArray(progresso.favoritos) 
        ? progresso.favoritos.length 
        : Object.keys(progresso.favoritos).length;
    }

    // Notas
    if (progresso.notas_pessoais) {
      stats.totalNotas = Object.keys(progresso.notas_pessoais).length;
    }

    return stats;
  }

  // Informações do usuário
  getInfoUsuario() {
    return {
      navegador: navigator.userAgent,
      idioma: navigator.language,
      plataforma: navigator.platform,
      online: navigator.onLine
    };
  }

  // Formatar data para nome de arquivo
  formatarData() {
    const agora = new Date();
    return agora.toISOString().split('T')[0];
  }

  // Sistema de notificações
  notificar(mensagem, tipo = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
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

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Adicionar animações CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Instância global
window.progressManager = new ProgressManager();
