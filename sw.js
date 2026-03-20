// Service Worker minimo - sin cache para evitar problemas
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  // Borrar TODOS los caches anteriores
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))));
  self.clients.claim();
});
// No cachear nada - siempre ir a la red
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => new Response('Sin conexión', {status: 503})));
});
