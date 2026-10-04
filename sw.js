// [RAR-FIX-16] Upgraded Service Worker with offline fallback + background sync
const CACHE_NAME = 'hackathon-master-v6';
const FONT_CACHE = 'hackathon-fonts-v4';
const CDN_CACHE = 'hackathon-cdn-v4';
const OFFLINE_QUEUE = 'gemini-offline-queue';

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
  '/compare.html',
  '/offline.html',

  '/style.css',
  '/styles/design-system.css',
  '/strategist.css',
  '/team_builder.css',
  '/hackathon_universe.css',

  '/theme.js',
  '/js/navbar.js',
  '/js/firebase.js',
  '/js/db.js',
  '/js/auth-ui.js',
  '/js/api.js',
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
  'https://cdn.jsdelivr.net/npm/mermaid',
];

// Install: precache all local assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS.filter(u => !u.includes('offline_data'))))
      .then(() => {
        // Cache the heavy offline data files individually (non-blocking)
        caches.open(CACHE_NAME).then(cache => {
          ['/offline_data_v3.js','/offline_data_1000.js','/offline_data_realworld.js','/offline_data_modules.js'].forEach(url => {
            fetch(url).then(r => { if(r.ok) cache.put(url, r); }).catch(() => {});
          });
        });
      })
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

  // Gemini API calls — network with offline queue on failure
  if (url.hostname === 'generativelanguage.googleapis.com') {
    event.respondWith(
      fetch(request.clone()).catch(async () => {
        // Queue the failed request for background sync
        const db = await openQueue();
        await db.add({ url: request.url, body: await request.text(), ts: Date.now() });
        // Return a structured offline response
        return new Response(JSON.stringify({
          offline: true,
          message: 'Request queued for retry when connection restores.'
        }), { headers: { 'Content-Type': 'application/json' } });
      })
    );
    return;
  }

  // External requests — network-only
  if (url.origin !== self.location.origin) {
    event.respondWith(fetch(request));
    return;
  }

  // Live data (updated daily by GitHub Actions) — network-first so it never goes stale
  if (url.pathname.startsWith('/data/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Local pages/styles/scripts — network-first so a redesign or bug fix is never hidden by an old
  // cached copy; the cache is only the offline fallback.
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then(cached => {
          if (cached) return cached;
          if (request.mode === 'navigate') return caches.match('/offline.html') || caches.match('/index.html');
        })
      )
  );
});

// Background sync — retry queued Gemini calls when online
self.addEventListener('sync', event => {
  if (event.tag === 'gemini-retry') {
    event.waitUntil(retryQueuedRequests());
  }
});

async function retryQueuedRequests() {
  try {
    const db = await openQueue();
    const items = await db.getAll();
    for (const item of items) {
      try {
        await fetch(item.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: item.body });
        await db.delete(item.id);
      } catch (e) { /* still offline, keep in queue */ }
    }
  } catch (e) { /* IndexedDB not available */ }
}

// Minimal IndexedDB queue helper
function openQueue() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(OFFLINE_QUEUE, 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
    req.onsuccess = e => {
      const db = e.target.result;
      resolve({
        add: data => new Promise((res, rej) => { const t = db.transaction('requests','readwrite'); t.objectStore('requests').add(data); t.oncomplete = res; t.onerror = rej; }),
        getAll: () => new Promise((res, rej) => { const t = db.transaction('requests','readonly'); const r = t.objectStore('requests').getAll(); r.onsuccess = () => res(r.result); r.onerror = rej; }),
        delete: id => new Promise((res, rej) => { const t = db.transaction('requests','readwrite'); t.objectStore('requests').delete(id); t.oncomplete = res; t.onerror = rej; }),
      });
    };
    req.onerror = reject;
  });
}

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
