const CACHE_NAME = "album-romantico-v1";

const FILES_TO_CACHE = [
  "/",
  "/index",
  "/calendar",
  "/static/style.css",
  "/static/script.js",
  "/static/audio/musica.mp3",
  "/static/audio/musica2.mp3"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
