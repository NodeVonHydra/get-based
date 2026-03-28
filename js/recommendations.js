// recommendations.js — Catalog loading, slot matching, HTML rendering for supplement & lifestyle recs

import { escapeHTML } from './utils.js';
import { getProfileLocation } from './profile.js';
import { state } from './state.js';

// ═══════════════════════════════════════════════
// CATALOG CACHE
// ═══════════════════════════════════════════════
let _catalog = undefined; // undefined = not loaded, null = load failed
let _catalogPromise = null; // deduplicates concurrent loads

export async function loadCatalog() {
  if (_catalog !== undefined) return _catalog;
  if (_catalogPromise) return _catalogPromise;
  _catalogPromise = (async () => {
    try {
      const res = await fetch('data/recommendations-czsk.json');
      if (!res.ok) { _catalog = null; return null; }
      _catalog = await res.json();
      return _catalog;
    } catch {
      _catalog = null;
      return null;
    } finally {
      _catalogPromise = null;
    }
  })();
  return _catalogPromise;
}

// For tests — reset cached catalog
export function _resetCatalog() { _catalog = undefined; _catalogPromise = null; }

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
  if (CZSK_COUNTRIES.includes(c)) return 'CZSK';
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
// CARD TIPS — lifestyle slots for context cards
// ═══════════════════════════════════════════════
const CARD_NAMES = {
  sleepRest: 'Sleep & Rest', lightCircadian: 'Light & Circadian',
  environment: 'Environment', exercise: 'Exercise',
  diet: 'Diet & Digestion', stress: 'Stress'
};

export function getCardSlotKeys(cardKey) {
  if (!_catalog || !_catalog.slots) return [];
  const cardName = CARD_NAMES[cardKey];
  if (!cardName) return [];
  return Object.keys(_catalog.slots).filter(k => _catalog.slots[k].card === cardName);
}

const CARD_LABELS = {
  sleepRest: { emoji: '\uD83D\uDE34', label: 'Sleep & Rest' },
  lightCircadian: { emoji: '\u2600\uFE0F', label: 'Light & Circadian' },
  environment: { emoji: '\uD83C\uDF0D', label: 'Environment' },
  exercise: { emoji: '\uD83C\uDFCB\uFE0F', label: 'Exercise' },
  diet: { emoji: '\uD83E\uDD57', label: 'Diet & Digestion' },
  stress: { emoji: '\uD83E\uDDE0', label: 'Stress' }
};

function _buildCardDNASection(cardKey) {
  const genetics = state.importedData?.genetics;
  if (!genetics || !genetics.snps) return '';
  const snpTable = window._snpTableCache;
  if (!snpTable) return '';
  const hints = [];
  const apoeRsids = new Set(['rs429358', 'rs7412']);
  for (const [rsid, stored] of Object.entries(genetics.snps)) {
    if (genetics.apoe && apoeRsids.has(rsid)) continue;
    const entry = snpTable[rsid];
    if (!entry || !entry.snpHints || !entry.contextCards || !entry.contextCards.includes(cardKey)) continue;
    const g = stored.genotype;
    if (!g) continue;
    const rev = g.length === 2 ? g[1] + g[0] : g;
    const sorted = _sortAlleles(g);
    const hint = entry.snpHints[g] || entry.snpHints[rev] || entry.snpHints[sorted];
    if (!hint) continue;
    const info = entry.genotypes?.[g] || entry.genotypes?.[rev] || entry.genotypes?.[sorted];
    if (info && info.effect === 'none') continue;
    const isAvoid = hint.direction === 'avoid';
    const icon = isAvoid ? '\u26A0' : '\u2192';
    const cls = isAvoid ? ' ctx-tip-avoid' : ' ctx-tip-free';
    const refLink = hint.ref && /^https?:\/\//.test(hint.ref) ? ` <a href="${escapeHTML(hint.ref)}" target="_blank" rel="noopener" style="font-size:11px;color:var(--accent);opacity:0.6">study</a>` : '';
    hints.push(`<div class="ctx-tip-item${cls}">${icon} <strong>${escapeHTML(stored.gene)}</strong> ${escapeHTML(g)} \u2014 ${escapeHTML(hint.text)}${refLink}</div>`);
  }
  if (!hints.length) return '';
  return `<div class="ctx-tip-slot"><div class="ctx-tip-slot-label">Your Genetics</div>${hints.join('')}</div>`;
}

export function renderCardTipsModal(cardKey) {
  if (!isProductRecsEnabled() || !_catalog || !_catalog.slots) return '';
  const slotKeys = getCardSlotKeys(cardKey);
  if (!slotKeys.length) return '';
  const cardInfo = CARD_LABELS[cardKey] || { emoji: '', label: cardKey };
  let items = _buildCardDNASection(cardKey);
  for (const sk of slotKeys) {
    const slot = _catalog.slots[sk];
    if (!slot) continue;
    const label = escapeHTML(slot.label || sk.split('.').pop());
    let tips = '';
    if (slot.freeActions?.length) {
      tips += `<div class="ctx-tip-tier"><div class="ctx-tip-tier-label">NATURE <span class="rec-tier-hint">best option</span></div>`;
      tips += slot.freeActions.map(a => `<div class="ctx-tip-item ctx-tip-free">${escapeHTML(a)}</div>`).join('');
      tips += `</div>`;
    }
    if (slot.forms?.length) {
      tips += `<div class="ctx-tip-tier"><div class="ctx-tip-tier-label">TOOLS & SUPPLEMENTS <span class="rec-tier-hint">if needed</span></div>`;
      tips += `<div class="ctx-tip-item ctx-tip-form">${slot.forms.map(f => escapeHTML(f)).join(' · ')}</div>`;
      tips += `</div>`;
    }
    if (tips) items += `<div class="ctx-tip-slot"><div class="ctx-tip-slot-label">${label}</div>${tips}</div>`;
  }
  if (!items) return '';
  return `<button class="modal-close" onclick="document.getElementById('modal-overlay').classList.remove('show')">\u00D7</button>
    <div class="ctx-tips-modal-header">${cardInfo.emoji} ${escapeHTML(cardInfo.label)} \u2014 Tips</div>
    <div class="ctx-tips-modal-body">${items}</div>`;
}

// ═══════════════════════════════════════════════
// DNA HINTS — connect genetics to recommendations
// ═══════════════════════════════════════════════

function _sortAlleles(g) { return g?.length === 2 ? g.split('').sort().join('') : g; }

export function buildDNAHints(slotKey) {
  const genetics = state.importedData?.genetics;
  if (!genetics || !genetics.snps) return [];
  const snpTable = window._snpTableCache;
  if (!snpTable) return [];

  const hints = [];

  // APOE haplotype — special handling
  if (genetics.apoe && slotKey === 'lipids.ldl') {
    const hap = genetics.apoe;
    if (hap.includes('\u03B54')) {
      hints.push({
        gene: 'APOE', variant: hap, genotype: hap, direction: 'form',
        text: hap === '\u03B54/\u03B54'
          ? 'Your APOE \u03B54/\u03B54 suggests strict saturated fat management and LDL particle monitoring \u2014 dietary fat significantly impacts your LDL'
          : `Your APOE ${hap} suggests moderating saturated fat and monitoring LDL response \u2014 dietary fat has amplified impact on your LDL`,
        ref: 'https://pubmed.ncbi.nlm.nih.gov/8346443/'
      });
    }
  }

  const apoeRsids = new Set(['rs429358', 'rs7412']);
  for (const [rsid, stored] of Object.entries(genetics.snps)) {
    if (genetics.apoe && apoeRsids.has(rsid)) continue;
    const entry = snpTable[rsid];
    if (!entry || !entry.snpHints) continue;

    const g = stored.genotype;
    if (!g) continue;
    const rev = g.length === 2 ? g[1] + g[0] : g;
    const sorted = _sortAlleles(g);
    const hint = entry.snpHints[g] || entry.snpHints[rev] || entry.snpHints[sorted];
    if (!hint || hint.slotKey !== slotKey) continue;

    // Skip if genotype effect is "none"
    const info = entry.genotypes?.[g] || entry.genotypes?.[rev] || entry.genotypes?.[sorted];
    if (info && info.effect === 'none') continue;

    hints.push({
      gene: stored.gene, variant: stored.variant, genotype: g,
      direction: hint.direction, text: hint.text, ref: hint.ref
    });
  }

  return hints;
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
  return `<div class="rec-disclosure">Some links may be affiliate links. Brands cannot pay for placement.</div>`;
}

function _buildDisclosureBanner() {
  if (hasSeenDisclosure()) return '';
  return `<div class="rec-disclosure-banner">
    These suggestions are informational, not medical advice. Always consult your healthcare provider before starting supplements. Affiliate links earn a small commission\u00a0\u2014 brands cannot pay for placement.
    <button class="rec-disclosure-btn" onclick="event.stopPropagation();markRecDisclosureSeen();const w=this.closest('.rec-disclosure-banner');const p=w.parentElement||w.parentNode;if(p){p.querySelectorAll('.rec-gated').forEach(d=>{d.classList.remove('rec-gated');d.open=true})}w.remove()">Got it</button>
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

  // DNA hints — prepend before tiers
  const dnaHints = buildDNAHints(slotKey);
  if (dnaHints.length > 0) {
    inner += `<div class="rec-dna-hints">`;
    inner += `<div class="rec-section-label">YOUR GENETICS</div>`;
    for (const h of dnaHints) {
      const isAvoid = h.direction === 'avoid';
      const icon = isAvoid ? '\u26A0' : '\u2192';
      const cls = isAvoid ? ' rec-dna-avoid' : '';
      const refLink = h.ref && /^https?:\/\//.test(h.ref) ? ` <a href="${escapeHTML(h.ref)}" target="_blank" rel="noopener" class="rec-dna-ref">study</a>` : '';
      inner += `<div class="rec-dna-row${cls}">${icon} ${escapeHTML(h.text)}${refLink}</div>`;
    }
    inner += `</div>`;
  }

  // Tier 1: Nature — free, best option (full width, listed)
  if (slot.freeActions && slot.freeActions.length) {
    inner += `<div class="rec-section-label">NATURE <span class="rec-tier-hint">best option</span></div>`;
    for (const action of slot.freeActions) {
      inner += `<div class="rec-item-free">${escapeHTML(action)}</div>`;
    }
  }

  // Tier 2: Whole food — inline
  if (foodProducts.length) {
    inner += `<div class="rec-section-label">WHOLE FOOD <span class="rec-tier-hint">from nature</span></div>`;
    for (const fp of foodProducts) inner += buildProductRow(fp);
  } else if (slot.foodForms && slot.foodForms.length) {
    inner += `<div class="rec-section-label">WHOLE FOOD <span class="rec-tier-hint">from nature</span></div>`;
    inner += `<div class="rec-item-food">${slot.foodForms.map(f => escapeHTML(f)).join(' · ')}</div>`;
  }

  // Tier 3: Tools
  if (toolProducts.length) {
    inner += `<div class="rec-section-label">TOOLS <span class="rec-tier-hint">supports nature</span></div>`;
    for (const tp of toolProducts) inner += buildProductRow(tp);
  } else if (slot.productForms && slot.productForms.length) {
    inner += `<div class="rec-section-label">TOOLS <span class="rec-tier-hint">supports nature</span></div>`;
    inner += `<div class="rec-item-form">${slot.productForms.map(t => escapeHTML(t)).join(' · ')}</div>`;
  }

  // Tier 4: Supplements — inline
  if (suppProducts.length) {
    inner += `<div class="rec-section-label">SUPPLEMENTS <span class="rec-tier-hint">last resort</span></div>`;
    for (const sp of suppProducts) inner += buildProductRow(sp);
  } else if (slot.forms && slot.forms.length) {
    inner += `<div class="rec-section-label">SUPPLEMENTS <span class="rec-tier-hint">last resort</span></div>`;
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
  'omega-3': ['omega 3', 'fish oil', /\bepa\b/, /\bdha\b/],
  'selenium': ['selenomethionine'],
  'zinc': ['zinc picolinate', 'zinc carnosine'],
  'nac': ['n-acetyl cysteine'],
  'glutathione': [/\bggt\b/],
  'homocysteine': ['methylation', 'b12 + folate'],
  'berberine': ['dihydroberberine'],
  'ashwagandha': ['ksm-66'],
  'testosterone': ['tongkat ali', 'fadogia'],
  'insulin': ['blood sugar', 'glucose spike'],
  'inflammation': ['hs-crp', 'hsCRP'],
  'liver support': [/\balt\b/, 'alanine aminotransferase', 'fatty liver', /\bnafld\b/, /\bmasld\b/],
  'recovery': [/\bldh\b/, 'lactate dehydrogenase', 'muscle damage', 'muscle recovery'],
  'bilirubin': ['gilbert', 'jaundice', 'unconjugated bilirubin', 'conjugation'],
  'kidney': ['creatinine', /\bgfr\b/, /\begfr\b/, 'renal function', 'nephron'],
  'hydration': [/\bbun\b/, 'blood urea nitrogen', /\burea\b/],
  'hba1c': ['glycated hemoglobin', 'a1c', 'long-term glucose', 'glucose control'],
  'hemoglobin': ['anemia', 'iron deficiency', 'erythropoiesis', 'heme iron'],
  'free testosterone': [/\bshbg\b/, 'bioavailable testosterone', 'free testo'],
  'free t4': ['thyroxine', /\bft4\b/, 'thyroid hormone'],
  'albumin': ['hypoalbuminemia', 'protein status'],
  'total protein': ['protein status', 'protein intake'],
  'cholesterol': ['total cholesterol', 'ldl particle', 'statin'],
  'progesterone': ['luteal phase', 'pregnenolone steal', 'corpus luteum'],
  'wbc': ['white blood cell', 'leukocyte', 'immune function', 'neutrophil'],
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
          if (terms.some(t => t instanceof RegExp ? t.test(lower) : lower.includes(t))) { matched = true; break; }
        }
      }
    }
    if (matched && !found.includes(slotKey)) found.push(slotKey);
  }

  // Second pass: gene name matching for DNA-aware detection
  const genetics = state.importedData?.genetics;
  if (genetics?.snps && window._snpTableCache) {
    const snpTable = window._snpTableCache;
    for (const [rsid, stored] of Object.entries(genetics.snps)) {
      const entry = snpTable[rsid];
      if (!entry || !entry.snpHints) continue;
      const g = stored.genotype;
      if (!g) continue;
      const rev = g.length === 2 ? g[1] + g[0] : g;
      const hint = entry.snpHints[g] || entry.snpHints[rev] || entry.snpHints[_sortAlleles(g)];
      if (!hint) continue;
      const geneRe = new RegExp('\\b' + stored.gene.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
      if (geneRe.test(lower) && !found.includes(hint.slotKey)) {
        // Verify slot exists in catalog
        if (_catalog.slots[hint.slotKey]) found.push(hint.slotKey);
      }
    }
  }

  const hasDNA = !!genetics?.snps;
  return found.slice(0, hasDNA ? 2 : 1);
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
  detectSupplementSlots,
  loadCatalog,
  buildDNAHints,
  getCardSlotKeys,
  renderCardTipsModal,
});
