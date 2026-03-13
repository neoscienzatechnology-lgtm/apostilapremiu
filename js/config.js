/**
 * Configuração de Caminhos para GitHub Pages
 * Ajusta automaticamente os caminhos baseado no ambiente
 */

// Detectar se está no GitHub Pages
const isGitHubPages = window.location.hostname.includes('github.io');
const repoName = isGitHubPages ? window.location.pathname.split('/')[1] : '';
const basePath = isGitHubPages ? `/${repoName}` : '';

// Função para ajustar caminhos
window.getAssetPath = function(path) {
  // Remove barra inicial se existir
  path = path.startsWith('/') ? path.slice(1) : path;
  
  // Retorna caminho relativo ou com base path
  return isGitHubPages ? `${basePath}/${path}` : `./${path}`;
};

// Ajustar Service Worker
if ('serviceWorker' in navigator && isGitHubPages) {
  navigator.serviceWorker.register(`${basePath}/sw.js`, {
    scope: `${basePath}/`
  }).then(reg => {
    console.log('SW registrado:', reg.scope);
  }).catch(err => {
    console.warn('SW falhou:', err);
  });
}

// Ajustar manifest
if (isGitHubPages) {
  const manifestLink = document.querySelector('link[rel="manifest"]');
  if (manifestLink) {
    manifestLink.href = `${basePath}/manifest.json`;
  }
}

// Exportar configuração
window.APP_CONFIG = {
  isGitHubPages,
  basePath,
  repoName,
  getAssetPath: window.getAssetPath
};

console.log('🌐 Ambiente:', isGitHubPages ? 'GitHub Pages' : 'Local');
console.log('📁 Base Path:', basePath || '(raiz)');
