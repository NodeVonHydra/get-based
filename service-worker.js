const CACHE_NAME = 'labcharts-v49';

const APP_SHELL = [
  '/index.html',
  '/styles.css',
  '/js/main.js',
  '/js/schema.js',
  '/js/constants.js',
  '/js/state.js',
  '/js/utils.js',
  '/js/theme.js',
  '/js/api.js',
  '/js/profile.js',
  '/js/data.js',
  '/js/pii.js',
  '/js/charts.js',
  '/js/notes.js',
  '/js/supplements.js',
  '/js/cycle.js',
  '/js/context-cards.js',
  '/js/pdf-import.js',
  '/js/export.js',
  '/js/chat.js',
  '/js/settings.js',
  '/js/glossary.js',
  '/js/feedback.js',
  '/js/tour.js',
  '/js/nav.js',
  '/js/views.js',
  '/js/crypto.js',
  '/site.html',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js',
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js',
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js',
];

// Install: pre-cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: route-based caching strategies
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Network-only: API calls (Anthropic, OpenRouter, Venice, OpenAlex, Ollama) — do NOT
  // intercept so streaming ReadableStream goes directly to the page without SW IPC buffering
  if (url.hostname === 'api.anthropic.com' || url.hostname === 'openrouter.ai' || /* ROUTSTR DISABLED: url.hostname === 'api.routstr.com' || */ url.hostname === 'api.venice.ai' || url.hostname === 'api.openalex.org' || url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return;
  }

  // Cache-first: versioned CDN libraries (immutable)
  if (url.hostname === 'cdn.jsdelivr.net') {
    event.respondWith(
      caches.match(event.request).then((cached) =>
        cached || fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
      )
    );
    return;
  }

  // Stale-while-revalidate: Google Fonts
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetched = fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        });
        return cached || fetched;
      })
    );
    return;
  }

  // Stale-while-revalidate: local app shell files
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});
