/**
 * Playground Seguro - Executa código JavaScript em ambiente isolado
 */

export class SecurePlayground {
  constructor(editorId, outputId, runButtonId) {
    this.editor = document.getElementById(editorId);
    this.output = document.getElementById(outputId);
    this.runButton = document.getElementById(runButtonId);
    this.iframe = null;
    
    this.init();
  }

  init() {
    this.runButton?.addEventListener('click', () => this.executar());
    this.editor?.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        this.executar();
      }
    });
  }

  criarIframeSandbox() {
    if (this.iframe) {
      this.iframe.remove();
    }

    this.iframe = document.createElement('iframe');
    this.iframe.style.display = 'none';
    this.iframe.sandbox = 'allow-scripts';
    document.body.appendChild(this.iframe);

    const logs = [];
    const iframeWindow = this.iframe.contentWindow;

    ['log', 'warn', 'error', 'info'].forEach(method => {
      iframeWindow.console[method] = (...args) => {
        logs.push({
          type: method,
          message: args.map(arg => {
            if (typeof arg === 'object') {
              try {
                return JSON.stringify(arg, null, 2);
              } catch {
                return String(arg);
              }
            }
            return String(arg);
          }).join(' ')
        });
      };
    });

    return { iframeWindow, logs };
  }

  executar() {
    const codigo = this.editor?.value || '';
    if (!codigo.trim()) {
      this.mostrarOutput('// Escreva algum código JavaScript...', 'info');
      return;
    }

    this.output.textContent = '⏳ Executando...';
    this.output.classList.remove('err');

    setTimeout(() => {
      try {
        const { iframeWindow, logs } = this.criarIframeSandbox();

        iframeWindow.eval(codigo);

        setTimeout(() => {
          if (logs.length === 0) {
            this.mostrarOutput('✓ Código executado (sem saída no console)', 'success');
          } else {
            const output = logs.map(log => {
              const prefix = {
                log: '→',
                warn: '⚠',
                error: '✗',
                info: 'ℹ'
              }[log.type] || '→';
              return `${prefix} ${log.message}`;
            }).join('\n');
            
            this.mostrarOutput(output, logs.some(l => l.type === 'error') ? 'error' : 'success');
          }

          this.iframe?.remove();
          this.iframe = null;
        }, 100);

      } catch (err) {
        this.mostrarOutput(`✗ Erro: ${err.message}`, 'error');
        this.iframe?.remove();
        this.iframe = null;
      }
    }, 50);
  }

  mostrarOutput(texto, tipo = 'success') {
    this.output.textContent = texto;
    this.output.classList.toggle('err', tipo === 'error');
  }

  destruir() {
    this.iframe?.remove();
    this.runButton?.removeEventListener('click', this.executar);
  }
}

// Inicialização automática
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.pg-wrap').forEach((wrap, index) => {
    const editorId = `pg-editor-${index}`;
    const outputId = `pg-output-${index}`;
    const runId = `pg-run-${index}`;

    const editor = wrap.querySelector('.pg-editor');
    const output = wrap.querySelector('.pg-out');
    const runBtn = wrap.querySelector('.pg-run');

    if (editor && output && runBtn) {
      editor.id = editorId;
      output.id = outputId;
      runBtn.id = runId;

      new SecurePlayground(editorId, outputId, runId);
    }
  });
});
