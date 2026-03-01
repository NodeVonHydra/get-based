// changelog.js — What's New modal, version tracking, auto-trigger on update
// APP_VERSION comes from /version.js (loaded as classic script before modules)

import { escapeHTML } from './utils.js';

const CHANGELOG = [
  {
    version: '1.1.4', date: '2026-03-01', title: 'Diet & Digestion',
    items: [
      'Diet card extended to "Diet & Digestion" with 10 new fields: bowel frequency, stool consistency, bloating, gas, acid reflux, burping, nausea, appetite, abdominal pain, and food sensitivities',
      'Digestive health data included in AI context for interpreting gut-related biomarkers',
    ]
  },
  {
    version: '1.1.3', date: '2026-02-28', title: 'Encryption Nudge',
    items: [
      'One-time prompt to enable encryption after your first PDF import',
      'Dismiss with "Not Now" or enable directly — never shown again once dismissed or encryption is on',
    ]
  },
  {
    version: '1.1.2', date: '2026-02-28', title: 'Documentation Update',
    items: [
      'New Specialty Labs guide page covering OAT, DUTCH, HTMA, and other non-blood test imports',
      'Updated 6 guide pages with OpenRouter OAuth, model tiers, pre-flight checks, chat FAB, Ollama opt-in PII, and batch retry',
      'Brand rename across all docs — "Get Based" → "getbased" per brand guidelines',
    ]
  },
  {
    version: '1.1.1', date: '2026-02-28', title: 'Model Guidance',
    items: [
      'Model dropdowns now split into Recommended and Other sections across all providers',
      'Active model shown in chat header and per-message cost footnotes',
      'Settings AI tab has a prominent guidance callout for model quality and consistency',
      'Switching providers with the same model no longer triggers a false mismatch warning',
    ]
  },
  {
    version: '1.1.0', date: '2026-02-28', title: 'Specialty Labs & Brand Refresh',
    items: [
      'Specialty lab support (beta) \u2014 OAT, amino acids, fatty acids, toxic elements, and more import with their own reference ranges and sidebar sections',
      'Brand refresh \u2014 new getbased gradient wordmark, SVG header icons, cleaner layout',
      'Batch import improvements \u2014 auto-retry on failure, single dashboard refresh at the end',
      'Ollama PII obfuscation is now opt-in (Settings \u2192 Privacy)',
      '\u20bf Donate button in header \u2014 support the project with Bitcoin',
    ]
  },
  {
    version: '1.0.5', date: '2026-02-27', title: 'One-Click OpenRouter',
    items: [
      'Connect to OpenRouter with one click — no more copying API keys',
      'OAuth button in chat setup guide and Settings for instant connection',
      'OpenRouter is now the first provider tab in Settings',
    ]
  },
  {
    version: '1.0.4', date: '2026-02-27', title: 'Simplified First Visit',
    items: [
      'New welcome hero — one focused card with drop zone and demo data instead of competing elements',
      'Context cards now collapsed behind a toggle so first-time users aren\u2019t overwhelmed',
    ]
  },
  {
    version: '1.0.3', date: '2026-02-27', title: 'Chat Improvements',
    items: [
      'Floating chat bubble in the bottom-right corner — always one tap away',
      'No API key? A friendly setup guide replaces the old error message',
    ]
  },
  {
    version: '1.0.2', date: '2026-02-27', title: 'Pre-Lab Onboarding',
    items: [
      'No lab data? No problem — fill your 9 context cards and the AI recommends exactly which tests to get',
      'Chat prompts adapt to your state: card-filling encouragement, personalized test recommendations, or lab analysis',
      'Dashboard nudge guides you through profile setup (sex, DOB, all 9 cards) before your first blood draw',
      'Health dots now work on context alone — the AI rates your lifestyle cards even without lab results',
    ]
  },
  {
    version: '1.0.1', date: '2026-02-27', title: 'Minor Tweaks',
    items: [
      'Minor tweaks and bug fixes',
    ]
  },
  {
    version: '1.0', date: '2026-02-25', title: 'Launch',
    items: [
      'AI-powered PDF import — drop any lab report, any language',
      '287+ biomarkers across 26 categories with interactive charts',
      'AI chat with customizable personalities for interpreting your results',
      'Menstrual cycle-aware lab interpretation with phase-specific ranges',
      '9 lifestyle context cards that shape AI analysis',
      'Fully private — all data stays in your browser',
    ]
  },
];

/** Extract major.minor from a semver string (e.g. '1.0.1' → '1.0') */
function getMajorMinor(ver) {
  const parts = String(ver).split('.');
  return parts.slice(0, 2).join('.');
}

function getSeenVersion() {
  return localStorage.getItem('labcharts-changelog-seen') || '';
}

function markChangelogSeen() {
  localStorage.setItem('labcharts-changelog-seen', String(window.APP_VERSION));
}

export function openChangelog(showAll) {
  const overlay = document.getElementById('changelog-modal-overlay');
  const modal = document.getElementById('changelog-modal');
  if (!overlay || !modal) return;

  const entries = showAll ? CHANGELOG : CHANGELOG.slice(0, 3);

  let html = `<button class="modal-close" onclick="closeChangelog()">&times;</button>`;
  html += `<h3>What's New</h3>`;

  for (const entry of entries) {
    html += `<div class="cl-entry">`;
    html += `<div class="cl-header"><span class="cl-version">v${escapeHTML(entry.version)} — ${escapeHTML(entry.title)}</span><span class="cl-date">${escapeHTML(entry.date)}</span></div>`;
    html += '<ul class="cl-items">';
    for (const item of entry.items) {
      html += `<li class="cl-item">${escapeHTML(item)}</li>`;
    }
    html += '</ul></div>';
  }

  modal.innerHTML = html;
  overlay.classList.add('show');
}

export function closeChangelog() {
  const overlay = document.getElementById('changelog-modal-overlay');
  if (overlay) overlay.classList.remove('show');
  markChangelogSeen();
}

export function maybeShowChangelog() {
  const seen = getSeenVersion();
  // Only show What's New on minor/major bumps, not patch
  if (getMajorMinor(seen) !== getMajorMinor(window.APP_VERSION)) {
    openChangelog(false);
  }
}

Object.assign(window, { openChangelog, closeChangelog, maybeShowChangelog });
