const CACHE_NAME = 'axe-workcenter-v1-7-1';
const APP_SHELL = ['./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./axe.png','./AXE ALL.png'];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).catch(() => {}));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      if (new URL(req.url).origin === location.origin) {
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {});
      }
      return res;
    }).catch(() => caches.match(req).then(cached => cached || caches.match('./index.html')))
  );
});
