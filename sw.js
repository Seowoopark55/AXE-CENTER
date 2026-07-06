const AXE_WORKCENTER_CACHE = 'axe-workcenter-v1-beta-20260706';
const ASSETS = ['./', './index.html', './manifest.webmanifest'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(AXE_WORKCENTER_CACHE).then(cache => cache.addAll(ASSETS)).catch(() => null));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => key === AXE_WORKCENTER_CACHE ? null : caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      caches.open(AXE_WORKCENTER_CACHE).then(cache => cache.put(req, copy)).catch(() => null);
      return res;
    }).catch(() => caches.match(req).then(cached => cached || caches.match('./index.html')))
  );
});
