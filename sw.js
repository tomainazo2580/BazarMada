const CACHE = "bazarmada-v28";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) return;
  if (e.request.url.indexOf("/admin") >= 0) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    const c = res.clone();
    caches.open(CACHE).then(cache => cache.put(e.request, c));
    return res;
  })));
});
