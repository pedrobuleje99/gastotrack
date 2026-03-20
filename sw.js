const CACHE = 'gastotrack-v5';
const ASSETS = [
  '/gastotrack/',
  '/gastotrack/index.html',
  '/gastotrack/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('generativelanguage.googleapis.com') ||
      e.request.url.includes('supabase.co') ||
      e.request.url.includes('fonts.googleapis.com') ||
      e.request.url.includes('cdnjs.cloudflare.com')) return;
  // Network first para index.html, cache fallback para el resto
  if (e.request.url.includes('index.html') || e.request.url.endsWith('/gastotrack/')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
