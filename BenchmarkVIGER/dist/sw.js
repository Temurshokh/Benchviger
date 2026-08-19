const CACHE_NAME = 'benchviger-v1.5';
const ASSETS = [
  './',
  './index.html',
  './src/css/main.css',
  './src/css/components.css',
  './src/css/charts.css',
  './src/css/mobile.css',
  './src/js/app.js',
  './src/js/database.js',
  './src/js/scoring.js',
  './src/js/comparison.js',
  './src/js/filters.js',
  './src/js/router.js',
  './src/js/ui.js',
  './src/data/gpu.json',
  './src/data/cpu.json',
  './src/data/ssd.json',
  './src/data/ram.json',
  './src/data/phones.json',
  './src/data/psu.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
