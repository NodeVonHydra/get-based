# Deployment

Get Based is deployed on Vercel. The app is static — no server-side code, no API routes, no backend. Vercel serves the files directly and injects security headers.

## Vercel configuration

`vercel.json` uses the legacy `routes` array (not `rewrites` or `headers`):

```json
{
  "routes": [
    {
      "src": "/(.*)",
      "headers": { "...CSP and security headers..." },
      "continue": true
    },
    { "src": "^/docs/?$",  "dest": "/dist-docs/index.html" },
    { "src": "^/docs/(.*)", "dest": "/dist-docs/$1" }
  ]
}
```

| Route | Destination |
|---|---|
| `/` | `index.html` — the application (served by Vercel filesystem default) |
| `/docs` | `dist-docs/index.html` — VitePress documentation |
| `/docs/*` | `dist-docs/*` — VitePress documentation assets and pages |
| Everything else | Served as-is from the filesystem (JS, CSS, images, manifest) |

## Domain layout

The app and landing page are deployed as two separate Vercel projects on the same domain:

| Subdomain | Vercel project | Repo |
|---|---|---|
| `getbased.health` | `get-based-site` | [elkimek/get-based-site](https://github.com/elkimek/get-based-site) |
| `app.getbased.health` | `get-based` | [elkimek/get-based](https://github.com/elkimek/get-based) |

VitePress builds to `dist-docs/` (configured via `outDir` in `docs/.vitepress/config.mjs`). The output is separate from the `docs/` source directory to avoid Vercel serving the source files as a directory listing.

## CSP headers

The Content-Security-Policy allows exactly what the app needs:

```
default-src 'self'
script-src  'self' 'unsafe-inline' https://cdn.jsdelivr.net
style-src   'self' 'unsafe-inline' https://fonts.googleapis.com
font-src    'self' https://fonts.gstatic.com
connect-src 'self'
            https://api.anthropic.com
            https://openrouter.ai
            https://api.venice.ai
            https://api.openalex.org
            http://localhost:*
            http://127.0.0.1:*
img-src     'self' data: blob:
worker-src  'self' https://cdn.jsdelivr.net blob:
manifest-src 'self'
frame-src   'none'
object-src  'none'
base-uri    'self'
```

`'unsafe-inline'` is required for scripts because `index.html` has inline `onclick` attributes (by design — the architecture relies on window-exported functions called from HTML). The CDN SRI hashes in `index.html` provide integrity verification as a compensating control.

`localhost:*` and `127.0.0.1:*` are in `connect-src` to allow Ollama (which runs locally on port 11434 by default).

If a new AI provider is added, its hostname must be added to `connect-src` in `vercel.json`.

## Service worker

The service worker (`service-worker.js`) manages PWA caching. The cache name includes a version number:

```js
const CACHE_NAME = 'labcharts-v55';
```

**When to bump the version:** Any time you change an app file — JS, CSS, HTML, manifest, images. Incrementing the version busts the cache for existing users, who will download fresh files on next visit.

The service worker uses three caching strategies:

| Resource type | Strategy |
|---|---|
| AI API calls (Anthropic, OpenRouter, Venice, Ollama, OpenAlex) | **Bypass** — `return` without `event.respondWith`. Streaming ReadableStreams must go directly to the page without SW IPC buffering |
| CDN libraries (Chart.js, pdf.js from cdn.jsdelivr.net) | **Cache-first** — serve from cache, fetch and cache if missing |
| Google Fonts | **Stale-while-revalidate** — serve cached, update in background |
| App shell (HTML, CSS, JS modules, images) | **Stale-while-revalidate** — serve cached, update in background |

The API bypass is critical for streaming. If the service worker intercepts a streaming SSE response, the IPC pipe between the SW and the page buffers the chunks, breaking the streaming experience. The bypass (returning without calling `event.respondWith`) routes requests directly to the network.

## PWA manifest

`manifest.json` makes the app installable as a native app on desktop and mobile:

```json
{
  "name": "Get Based",
  "short_name": "Get Based",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f1117",
  "theme_color": "#0f1117",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon.svg",     "sizes": "any",     "type": "image/svg+xml" }
  ]
}
```

## ROUTSTR DISABLED markers

The Routstr provider was disabled on Feb 23 2026 due to a CORS bug on their `/v1/chat/completions` endpoint (tracked at github.com/Routstr/routstr-core/issues/375). All Routstr code is commented out with `// ROUTSTR DISABLED` markers across 12 files.

To find every affected location:

```bash
grep -r "ROUTSTR DISABLED" .
```

To re-enable when the CORS issue is fixed: uncomment all marked blocks, add Routstr back to the provider button row in `settings.js`, update the grid to `repeat(5, 1fr)`, bump the service worker cache version, and add `api.routstr.com` to `connect-src` in `vercel.json`.

## SRI hashes

CDN dependencies in `index.html` include `integrity` and `crossorigin` attributes. If you update a CDN library version, regenerate the hash:

```bash
curl -s https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js \
  | openssl dgst -sha384 -binary | openssl base64 -A
```

Prefix the output with `sha384-` and update the `integrity` attribute.
