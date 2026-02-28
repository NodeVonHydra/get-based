// changelog.js — What's New modal, version tracking, auto-trigger on update
// APP_VERSION comes from /version.js (loaded as classic script before modules)

import { escapeHTML } from './utils.js';

const CHANGELOG = [
  {
    version: '1.0.8', date: '2026-02-28', title: 'Import & UX Polish',
    items: [
      'Ollama PII is now opt-in \u2014 toggle it on in Settings \u2192 Privacy instead of auto-detecting',
      'Batch import retries failed files automatically after a cooldown delay',
      'Batch import no longer triggers dashboard refresh after every file \u2014 one update at the end',
      'Data entries moved to Settings \u2192 Data tab; dashboard shows only Notes with a card design',
      'Fixed PhenoAge calculation that showed N/A due to unit conversion overflow',
    ]
  },
  {
    version: '1.0.7', date: '2026-02-28', title: 'Test-Type Sidebar Grouping',
    items: [
      'AI now auto-detects test type (OAT, DUTCH, HTMA, GI, blood) and keeps specialty markers separate from blood work',
      'Sidebar groups specialty categories under collapsible headers \u2014 OAT, DUTCH, HTMA each get their own section',
      'Collapse state persists across page loads; search expands groups to show matches',
    ]
  },
  {
    version: '1.0.6', date: '2026-02-27', title: 'Specialty Lab & Token Savings',
    items: [
      'Improved support for Metabolomix+ and Mosaic OAT \u2014 each lab now uses its own reference ranges',
      'Overall improvements on token costs for AI-powered PDF import',
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
