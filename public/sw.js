const CACHE_NAME = 'music-vip-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Limpiar todos los cachés antiguos para que el navegador cargue los nuevos assets
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Ignorar peticiones que no sean GET o que sean de streaming/youtube/api
  if (
    event.request.method !== 'GET' ||
    event.request.url.includes('/api/') ||
    event.request.url.includes('youtube.com') ||
    event.request.url.includes('googlevideo.com') ||
    event.request.url.includes('googleapis.com')
  ) {
    return;
  }

  // Network-First para páginas y navegación HTML (siempre obtener la última versión desplegada)
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Network-First para scripts y estilos
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
