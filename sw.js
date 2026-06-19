const CACHE_NAME = 'hackathon-master-v1';
const FONT_CACHE = 'hackathon-fonts-v1';
const CDN_CACHE = 'hackathon-cdn-v1';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/strategist.html',
  '/team_builder.html',
  '/checklist.html',
  '/features.html',
  '/countdown.html',
  '/hackathons.html',
  '/hackathon_universe.html',
  '/repos.html',
  '/check.html',
  '/generator.html',
  '/showcase.html',

  '/style.css',
  '/strategist.css',
  '/team_builder.css',
  '/hackathon_universe.css',

  '/theme.js',
  '/app_v2.js',
  '/strategist.js',
  '/team_builder.js',
  '/hackathon_universe.js',
  '/hackathons_config.js',
  '/history_manager.js',
  '/projects_app.js',
  '/serper_provider.js',

  '/offline_data_v3.js',
  '/offline_data_1000.js',
  '/offline_data_realworld.js',
  '/offline_data_modules.js',

  '/logo.png',
  '/favicon.png',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
];

const CDN_URLS = [
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js',
];

// Install: precache all local assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: remove stale caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => ![CACHE_NAME, FONT_CACHE, CDN_CACHE].includes(key))
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Google Fonts — cache-first, long-lived
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, FONT_CACHE));
    return;
  }

  // Known CDN assets — cache-first
  if (CDN_URLS.some(u => request.url.startsWith(u))) {
    event.respondWith(cacheFirst(request, CDN_CACHE));
    return;
  }

  // External requests (APIs, Serper, etc.) — network-only
  if (url.origin !== self.location.origin) {
    event.respondWith(fetch(request));
    return;
  }

  // Local assets — cache-first, fall back to network
  // For page navigations fall back to index.html so the app shell loads offline
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});

function cacheFirst(request, cacheName) {
  return caches.match(request).then(cached => {
    if (cached) return cached;
    return fetch(request).then(response => {
      if (response.ok) {
        const clone = response.clone();
        caches.open(cacheName).then(cache => cache.put(request, clone));
      }
      return response;
    });
  });
}
