#!/usr/bin/env node
// Local dev server that mirrors production routing:
//   /        → landing page (from ../get-based-site or SITE_DIR)
//   /app     → the app (index.html)
//   /docs/*  → built VitePress docs
// Usage: node dev-server.js [port]
//        SITE_DIR=/path/to/get-based-site node dev-server.js

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.argv[2], 10) || 8000;
const ROOT = __dirname;
const SITE_DIR = process.env.SITE_DIR || path.join(ROOT, '..', 'get-based-site');
const SITE_INDEX = path.join(SITE_DIR, 'index.html');
const hasSite = fs.existsSync(SITE_INDEX);

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.ico': 'image/x-icon', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
  '.pdf': 'application/pdf', '.txt': 'text/plain', '.xml': 'application/xml',
  '.webmanifest': 'application/manifest+json',
};

function serveFile(res, filePath) {
  const resolved = path.resolve(filePath);
  fs.readFile(resolved, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(resolved).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(url.pathname);

  // Route: / → landing page (if site repo found) or app
  if (pathname === '/') {
    if (hasSite) return serveFile(res, SITE_INDEX);
    return serveFile(res, path.join(ROOT, 'index.html'));
  }

  // Route: /app → index.html (redirect trailing slash to avoid broken relative paths)
  if (pathname === '/app/') {
    res.writeHead(301, { 'Location': '/app' }); res.end(); return;
  }
  if (pathname === '/app') {
    return serveFile(res, path.join(ROOT, 'index.html'));
  }

  // Route: /docs → dist-docs/
  if (pathname === '/docs' || pathname === '/docs/') {
    return serveFile(res, path.join(ROOT, 'dist-docs', 'index.html'));
  }
  if (pathname.startsWith('/docs/')) {
    let docPath = pathname.slice(6); // strip "/docs/"
    let filePath = path.join(ROOT, 'dist-docs', docPath);
    // Try exact file, then with .html, then index.html in directory
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return serveFile(res, filePath);
    }
    if (fs.existsSync(filePath + '.html')) {
      return serveFile(res, filePath + '.html');
    }
    if (fs.existsSync(path.join(filePath, 'index.html'))) {
      return serveFile(res, path.join(filePath, 'index.html'));
    }
    res.writeHead(404); res.end('Not found'); return;
  }

  // Route: /blog and /blog/{slug} → blog.html (mirrors Vercel rewrites)
  if (hasSite && (pathname === '/blog' || /^\/blog\/[^/]+$/.test(pathname))) {
    return serveFile(res, path.join(SITE_DIR, 'blog.html'));
  }

  // Static files from site repo (e.g. /thank-you.html, /icon.svg)
  // Skip files that also exist in the app root to avoid shadowing (index.html, vercel.json, etc.)
  if (hasSite) {
    let siteFile = path.join(SITE_DIR, pathname);
    let appFile = path.join(ROOT, pathname);
    // Only serve from site if the file doesn't also exist in the app root
    if (fs.existsSync(siteFile) && fs.statSync(siteFile).isFile() && !(fs.existsSync(appFile) && fs.statSync(appFile).isFile())) {
      return serveFile(res, siteFile);
    }
    // Clean URL: try .html append (only for site-specific pages like /thank-you)
    if (fs.existsSync(siteFile + '.html') && !(fs.existsSync(appFile + '.html'))) {
      return serveFile(res, siteFile + '.html');
    }
  }

  // Proxy: /proxy?url=... — fetches external URLs (dev only, for test tools)
  if (pathname === '/proxy') {
    const targetUrl = url.searchParams.get('url');
    if (!targetUrl) { res.writeHead(400); res.end('Missing url param'); return; }
    const fetcher = targetUrl.startsWith('https') ? https : http;
    fetcher.get(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (proxyRes) => {
      // Follow redirects
      if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
        const redirect = new URL(proxyRes.headers.location, targetUrl).href;
        const rFetcher = redirect.startsWith('https') ? https : http;
        rFetcher.get(redirect, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (rRes) => {
          res.writeHead(rRes.statusCode, { 'Content-Type': rRes.headers['content-type'] || 'application/octet-stream', 'Access-Control-Allow-Origin': '*' });
          rRes.pipe(res);
        }).on('error', e => { res.writeHead(502); res.end(e.message); });
        return;
      }
      res.writeHead(proxyRes.statusCode, { 'Content-Type': proxyRes.headers['content-type'] || 'application/octet-stream', 'Access-Control-Allow-Origin': '*' });
      proxyRes.pipe(res);
    }).on('error', e => { res.writeHead(502); res.end(e.message); });
    return;
  }

  // Static files from root
  let filePath = path.join(ROOT, pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return serveFile(res, filePath);
  }

  res.writeHead(404); res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}`);
  if (hasSite) {
    console.log(`  /        → landing page (${SITE_DIR})`);
    console.log(`  /app     → index.html`);
  } else {
    console.log(`  /        → index.html (no site repo found at ${SITE_DIR})`);
  }
  console.log(`  /docs/*  → dist-docs/*`);
});
