#!/usr/bin/env node
// Fetch a URL with headless Chrome and return rendered HTML
// Usage: node fetch-rendered.mjs <url>
// Returns JSON: { status, html, productCount }

import puppeteer from '/home/elkim/.npm/_npx/7d92d9a2d2ccc630/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';

const url = process.argv[2];
if (!url) { console.log(JSON.stringify({ status: 0, error: 'No URL provided' })); process.exit(1); }

try {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');

  const response = await page.goto(url, { waitUntil: 'networkidle0', timeout: 20000 });
  const status = response?.status() || 0;

  // Wait a bit more for lazy-loaded content
  await new Promise(r => setTimeout(r, 1000));

  // Try to extract products from the rendered page using multiple strategies
  const products = await page.evaluate(() => {
    const items = [];

    // Strategy A: visible text in product containers
    const seen = new Set();
    const boxes = document.querySelectorAll('[class*="product-box"], [class*="product-card"], [class*="product-item"], article[class*="product"]');
    for (const box of boxes) {
      const link = box.querySelector('a[href]');
      const titleEl = box.querySelector('[class*="title"], [class*="name"], h2, h3, h4');
      // Get the first/main price only (avoid old price, per-unit price)
      const priceEl = box.querySelector('[class*="price-value"], [class*="price--main"], [class*="price-final"], [class*="price"]:not([class*="old"]):not([class*="per-unit"])');
      const name = titleEl?.textContent?.trim() || '';
      const priceRaw = priceEl?.textContent?.trim() || '';
      // Extract first number + currency from price text
      const priceMatch = priceRaw.match(/(\d[\d\s,.]*)\s*(Kč|CZK|€|EUR)/);
      const price = priceMatch ? priceMatch[1].replace(/\s/g, '') + ' ' + priceMatch[2] : '';
      const url = link?.getAttribute('href') || '';
      // Deduplicate by name+url
      const key = name + '|' + url;
      if (name.length > 5 && name.length < 200 && !seen.has(key)) {
        seen.add(key);
        items.push({ name, price, url });
      }
    }

    // Strategy B: JSON-LD
    for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
      try {
        let data = JSON.parse(script.textContent);
        const arr = data['@graph'] || (Array.isArray(data) ? data : [data]);
        for (const item of arr) {
          if (item['@type'] === 'Product' && item.name) {
            const offer = Array.isArray(item.offers) ? item.offers[0] : item.offers || {};
            items.push({ name: item.name, price: offer.price ? offer.price + ' ' + (offer.priceCurrency || '') : '', url: item.url || '' });
          }
          if (item['@type'] === 'ItemList' && item.itemListElement) {
            for (const el of item.itemListElement) {
              const p = el.item || el;
              if (p.name) {
                const o = Array.isArray(p.offers) ? p.offers[0] : p.offers || {};
                items.push({ name: p.name, price: o.price ? o.price + ' ' + (o.priceCurrency || '') : '', url: p.url || '' });
              }
            }
          }
        }
      } catch {}
    }

    return items;
  });

  const html = await page.content();
  await browser.close();

  // Return both rendered HTML (for server-side extraction) and pre-extracted products
  console.log(JSON.stringify({ status, html, products }));
} catch (e) {
  console.log(JSON.stringify({ status: 0, error: e.message }));
  process.exit(1);
}
