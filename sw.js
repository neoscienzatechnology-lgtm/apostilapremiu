const CACHE_NAME = 'apostila-js-v1.0.0';
const OFFLINE_URL = '/offline.html';

const STATIC_ASSETS = [
  '/',
  '/apostila-javascript-premium.html',
  '/css/output.css',
  '/js/sanitize.js',
  '/js/playground.js',
  '/js/app.js',
  '/manifest.json',
  OFFLINE_URL
];

const FONT_CACHE = 'fonts-cache-v1';
const IMAGE_CACHE = 'images-cache-v1';
const API_CACHE = 'api-cache-v1';

// Instalação - cacheia assets estáticos
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cache aberto');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação - limpa caches antigos
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando Service Worker...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== FONT_CACHE && 
              cacheName !== IMAGE_CACHE &&
              cacheName !== API_CACHE) {
            console.log('[SW] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - estratégias de cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora requisições não-HTTP
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Estratégia: Cache First para assets estáticos
  if (STATIC_ASSETS.some(asset => url.pathname.includes(asset))) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Estratégia: Cache First para fontes
  if (request.destination === 'font' || url.hostname.includes('fonts.g')) {
    event.respondWith(cacheFirst(request, FONT_CACHE));
    return;
  }

  // Estratégia: Cache First para imagens
  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // Estratégia: Network First para APIs
  if (url.pathname.includes('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // Estratégia: Network First para HTML
  if (request.destination === 'document') {
    event.respondWith(networkFirst(request));
    return;
  }

  // Padrão: Network First
  event.respondWith(networkFirst(request));
});

// Cache First: busca no cache, se não achar vai na rede
async function cacheFirst(request, cacheName = CACHE_NAME) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    console.log('[SW] Cache hit:', request.url);
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Fetch falhou:', error);
    
    // Retorna página offline se for documento HTML
    if (request.destination === 'document') {
      const offlineCache = await caches.open(CACHE_NAME);
      return offlineCache.match(OFFLINE_URL);
    }
    
    throw error;
  }
}

// Network First: tenta rede primeiro, fallback para cache
async function networkFirst(request, cacheName = CACHE_NAME) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] Network falhou, buscando cache:', request.url);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Retorna página offline se for documento HTML
    if (request.destination === 'document') {
      return cache.match(OFFLINE_URL);
    }
    
    throw error;
  }
}

// Mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }).then(() => {
        event.ports[0].postMessage({ success: true });
      })
    );
  }
});

// Sincronização em background (quando voltar online)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

async function syncProgress() {
  // Sincroniza progresso do usuário quando voltar online
  console.log('[SW] Sincronizando progresso...');
  // Implementar lógica de sincronização aqui
}
