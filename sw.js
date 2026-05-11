// Run It Back — service worker (network-first for HTML/JS/CSS so updates ship; cache-first for everything else)
const CACHE = "run-it-back-v2";
const ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/manifest.webmanifest"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const isCore = url.origin === self.location.origin && /\.(html|js|css|webmanifest)$|\/$/i.test(url.pathname);

  if (isCore) {
    // Network-first for core app files so deploys propagate immediately
    event.respondWith(
      fetch(req).then(resp => {
        if (resp.ok) {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return resp;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Cache-first for fonts, images, third-party assets
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(resp => {
      if (resp.ok && url.origin === self.location.origin) {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return resp;
    }).catch(() => cached))
  );
});
