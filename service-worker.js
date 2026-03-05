importScripts('/version.js');
const CACHE_NAME = `labcharts-v${self.APP_VERSION}`;

// Local app shell — pre-cached on install
const APP_SHELL = [
  '/version.js',
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
  '/js/changelog.js',
  '/js/client-list.js',
  '/js/nav.js',
  '/js/views.js',
  '/js/crypto.js',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
];

// CDN libraries — NOT pre-cached (CSP blocks SW fetch for cross-origin).
// Cached on first page load via the fetch handler's cache-first strategy.

// Install: pre-cache local app shell only
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

  // Skip non-http(s) schemes (chrome-extension://, etc.) — Cache API only supports http/https
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return;

  // Network-only: API calls (Anthropic, OpenRouter, Venice, OpenAlex, Ollama) — do NOT
  // intercept so streaming ReadableStream goes directly to the page without SW IPC buffering
  // Also skip private/LAN IPs (Local AI on another machine)
  const h = url.hostname;
  if (h === 'api.anthropic.com' || h === 'openrouter.ai' || /* ROUTSTR DISABLED: h === 'api.routstr.com' || */ h === 'api.venice.ai' || h === 'api.openalex.org' || h === 'api.github.com' || h === 'cloud.umami.is' || h === 'api-gateway.umami.dev' || h === 'localhost' || h === '127.0.0.1' || h === '::1' || h.startsWith('192.168.') || h.startsWith('10.') || /^172\.(1[6-9]|2\d|3[01])\./.test(h)) {
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
