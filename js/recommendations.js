// recommendations.js — Catalog loading, slot matching, HTML rendering for supplement & lifestyle recs

import { escapeHTML } from './utils.js';
import { getProfileLocation } from './profile.js';

// ═══════════════════════════════════════════════
// CATALOG CACHE
// ═══════════════════════════════════════════════
let _catalog = undefined; // undefined = not loaded, null = load failed

export async function loadCatalog() {
  if (_catalog !== undefined) return _catalog;
  try {
    const res = await fetch('data/recommendations-czsk.json');
    if (!res.ok) { _catalog = null; return null; }
    _catalog = await res.json();
    return _catalog;
  } catch {
    _catalog = null;
    return null;
  }
}

// For tests — reset cached catalog
export function _resetCatalog() { _catalog = undefined; }

// ═══════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════
export function isProductRecsEnabled() {
  return localStorage.getItem('labcharts-show-product-recs') !== 'false';
}

export function setProductRecsEnabled(on) {
  localStorage.setItem('labcharts-show-product-recs', on ? 'true' : 'false');
}

export function hasSeenDisclosure() {
  return localStorage.getItem('labcharts-rec-disclosure') === 'seen';
}

export function markDisclosureSeen() {
  localStorage.setItem('labcharts-rec-disclosure', 'seen');
}

// ═══════════════════════════════════════════════
// REGION
// ═══════════════════════════════════════════════
const CZSK_COUNTRIES = ['czechia', 'czech republic', 'česko', 'cesko', 'cz', 'slovakia', 'slovensko', 'sk'];

export function getUserRegion() {
  const loc = getProfileLocation();
  if (!loc.country) return 'EU';
  const c = loc.country.toLowerCase().trim();
  for (const name of CZSK_COUNTRIES) {
    if (c === name || c.includes(name)) return 'CZSK';
  }
  return 'EU';
}

// ═══════════════════════════════════════════════
// PRODUCT FILTERING
// ═══════════════════════════════════════════════
export function getProductsForSlot(catalog, slotKey, region) {
  if (!catalog || !catalog.products) return [];
  const products = catalog.products[slotKey];
  if (!products || !products.length) return [];
  // CZSK users see CZ + SK + EU + INTL products; EU users see EU + INTL
  const regionCodes = region === 'CZSK' ? ['CZ', 'SK', 'EU', 'INTL'] : ['EU', 'INTL'];
  return products.filter(p => p.regions && p.regions.some(r => regionCodes.includes(r)));
}

// ═══════════════════════════════════════════════
// SLOT LOOKUP FOR CONTEXT CARDS
// ═══════════════════════════════════════════════
export function getSlotsForCard(catalog, cardKey) {
  if (!catalog || !catalog.slots) return [];
  const cardNames = {
    sleepRest: 'Sleep & Rest',
    lightCircadian: 'Light & Circadian',
    environment: 'Environment',
    exercise: 'Exercise',
    diet: 'Diet & Digestion',
    stress: 'Stress'
  };
  const cardName = cardNames[cardKey];
  if (!cardName) return [];
  return Object.entries(catalog.slots)
    .filter(([, slot]) => slot.card === cardName)
    .map(([key]) => key);
}

// ═══════════════════════════════════════════════
// HTML RENDERING
// ═══════════════════════════════════════════════
function buildProductRow(product) {
  const parts = [];
  if (product.brand) parts.push(`<strong>${escapeHTML(product.brand)}</strong>`);
  if (product.name) parts.push(escapeHTML(product.name));
  const meta = [];
  if (product.dosage) meta.push(escapeHTML(product.dosage));
  if (product.priceCZK) meta.push(`~${escapeHTML(String(product.priceCZK))} CZK`);
  else if (product.priceEUR) meta.push(`~\u20AC${escapeHTML(String(product.priceEUR))}`);
  const url = product.affiliateUrl || product.url;
  const isValid = url && /^https?:\/\//.test(url);
  return `<div class="rec-product">
    <span class="rec-product-info">${parts.join(' \u00b7 ')}${meta.length ? ' \u00b7 ' + meta.join(' \u00b7 ') : ''}</span>
    ${isValid ? `<a class="rec-product-link" href="${escapeHTML(url)}" target="_blank" rel="noopener">View \u2192</a>` : ''}
  </div>`;
}

function buildDisclosureFooter() {
  return `<div class="rec-disclosure">Affiliate disclosure: We earn a small commission from links below. Brands cannot pay for placement.</div>`;
}

function _buildDisclosureBanner() {
  if (hasSeenDisclosure()) return '';
  return `<div class="rec-disclosure-banner">
    These suggestions are informational, not medical advice. Always consult your healthcare provider before starting supplements. Affiliate links earn a small commission\u00a0\u2014 brands cannot pay for placement.
    <button class="rec-disclosure-btn" onclick="event.stopPropagation();markRecDisclosureSeen();const w=this.closest('.rec-disclosure-banner');w.nextElementSibling.classList.remove('rec-gated');w.remove()">Got it</button>
  </div>`;
}

// Sync core — builds HTML from cached catalog, no promises
function _renderRecSection(slotKey, opts = {}) {
  if (!_catalog || !_catalog.slots) return '';
  const slot = _catalog.slots[slotKey];
  if (!slot) return '';

  const label = opts.label || 'What can help';
  const maxProducts = opts.maxProducts || 3;
  const region = getUserRegion();
  const products = getProductsForSlot(_catalog, slotKey, region);

  const knownTypes = ['food', 'supplement', 'product', 'drug'];
  const foodProducts = products.filter(p => p.type === 'food').slice(0, maxProducts);
  const toolProducts = products.filter(p => p.type === 'product').slice(0, maxProducts);
  const suppProducts = products.filter(p => p.type === 'supplement').slice(0, maxProducts);
  const drugProducts = products.filter(p => p.type === 'drug').slice(0, maxProducts);
  const otherProducts = products.filter(p => !knownTypes.includes(p.type)).slice(0, maxProducts);

  let inner = '';

  if (slot.freeActions && slot.freeActions.length) {
    inner += `<div class="rec-section-label">FREE ACTIONS</div>`;
    for (const action of slot.freeActions) {
      inner += `<div class="rec-item-free">${escapeHTML(action)}</div>`;
    }
  }

  if (foodProducts.length) {
    inner += `<div class="rec-section-label">FOOD SOURCES</div>`;
    for (const fp of foodProducts) inner += buildProductRow(fp);
  } else if (slot.foodForms && slot.foodForms.length) {
    inner += `<div class="rec-section-label">FOOD SOURCES</div>`;
    for (const food of slot.foodForms) {
      inner += `<div class="rec-item-food">${escapeHTML(food)}</div>`;
    }
  }

  if (toolProducts.length) {
    inner += `<div class="rec-section-label">TOOLS</div>`;
    for (const tp of toolProducts) inner += buildProductRow(tp);
  } else if (slot.productForms && slot.productForms.length) {
    inner += `<div class="rec-section-label">TOOLS</div>`;
    for (const tool of slot.productForms) {
      inner += `<div class="rec-item-form">${escapeHTML(tool)}</div>`;
    }
  }

  if (suppProducts.length) {
    inner += `<div class="rec-section-label">SUPPLEMENTS</div>`;
    for (const sp of suppProducts) inner += buildProductRow(sp);
  } else if (slot.forms && slot.forms.length) {
    inner += `<div class="rec-section-label">LOOK FOR</div>`;
    inner += `<div class="rec-item-form">${slot.forms.map(f => escapeHTML(f)).join(', ')}</div>`;
  }

  if (drugProducts.length) {
    inner += `<div class="rec-section-label">PHARMACEUTICALS</div>`;
    for (const dp of drugProducts) inner += buildProductRow(dp);
    inner += `<div class="rec-drug-warning">Pharmaceutical-grade compounds may require medical supervision and can interact with medications. Consult your physician before use.</div>`;
  }

  if (otherProducts.length) {
    inner += `<div class="rec-section-label">OTHER</div>`;
    for (const op of otherProducts) inner += buildProductRow(op);
  }

  if (!inner) return '';
  const hasProducts = products.length > 0;
  const gated = !hasSeenDisclosure() ? ' rec-gated' : '';
  return `${_buildDisclosureBanner()}<details class="rec-details${gated}" onclick="event.stopPropagation();if(this.classList.contains('rec-gated')){this.open=false;const b=this.previousElementSibling;if(b){b.classList.remove('rec-nudge');void b.offsetWidth;b.classList.add('rec-nudge')}}">
    <summary class="rec-summary">${escapeHTML(label)}</summary>
    <div class="rec-content">${inner}${hasProducts ? buildDisclosureFooter() : ''}</div>
  </details>`;
}

// Sync version — uses cached catalog, returns '' if not loaded yet
export function renderRecommendationSectionSync(slotKey, opts = {}) {
  if (!isProductRecsEnabled()) return '';
  return _renderRecSection(slotKey, opts);
}

// Async version — ensures catalog is loaded first
export async function renderRecommendationSection(slotKey, opts = {}) {
  if (!isProductRecsEnabled()) return '';
  await loadCatalog();
  return _renderRecSection(slotKey, opts);
}

// ═══════════════════════════════════════════════
// KEYWORD SCANNER — detect supplement slots from AI text
// ═══════════════════════════════════════════════

// Extra keywords beyond what the catalog label provides (keyed by label fragment)
const EXTRA_TERMS = {
  'vitamin d': ['vitd', 'd3', 'cholecalciferol', '25-oh'],
  'vitamin b12': ['b12', 'cobalamin', 'methylcobalamin'],
  'vitamin a': ['retinol', 'retinyl'],
  'vitamin k': ['mk-7', 'menaquinone'],
  'magnesium': ['mag glycinate', 'mag citrate'],
  'iron': ['ferritin', 'ferrous', 'iron bisglycinate'],
  'omega-3': ['omega 3', 'fish oil', 'epa', 'dha'],
  'selenium': ['selenomethionine'],
  'zinc': ['zinc picolinate', 'zinc carnosine'],
  'nac': ['n-acetyl cysteine'],
  'glutathione': ['ggt'],
  'homocysteine': ['methylation', 'b12 + folate'],
  'berberine': ['dihydroberberine'],
  'ashwagandha': ['ksm-66'],
  'testosterone': ['tongkat ali', 'fadogia'],
  'insulin': ['blood sugar', 'glucose spike'],
  'inflammation': ['hs-crp', 'hsCRP'],
};

export function detectSupplementSlots(text) {
  if (!text || !_catalog || !_catalog.slots) return [];
  const lower = text.toLowerCase();
  const found = [];

  for (const [slotKey, slot] of Object.entries(_catalog.slots)) {
    // Skip lifestyle slots (those have a card property)
    if (slot.card) continue;
    const label = (slot.label || '').toLowerCase();
    // Match against slot label
    let matched = label.length > 3 && lower.includes(label);
    // Match against forms
    if (!matched && slot.forms) {
      matched = slot.forms.some(f => f.length > 3 && lower.includes(f.toLowerCase()));
    }
    // Match against extra keywords for this label
    if (!matched) {
      for (const [fragment, terms] of Object.entries(EXTRA_TERMS)) {
        if (label.includes(fragment)) {
          if (terms.some(t => lower.includes(t))) { matched = true; break; }
        }
      }
    }
    if (matched && !found.includes(slotKey)) found.push(slotKey);
  }
  return found.slice(0, 1); // Single most relevant slot
}

// ═══════════════════════════════════════════════
// WINDOW EXPORTS
// ═══════════════════════════════════════════════
Object.assign(window, {
  isProductRecsEnabled,
  setProductRecsEnabled,
  markRecDisclosureSeen: markDisclosureSeen,
  renderRecommendationSection,
  renderRecommendationSectionSync,
  getSlotsForCard,
  detectSupplementSlots,
  loadCatalog,
});
