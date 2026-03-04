// changelog.js — What's New modal, version tracking, auto-trigger on update
// APP_VERSION comes from /version.js (loaded as classic script before modules)

import { escapeHTML } from './utils.js';

const CHANGELOG = [
  {
    version: '1.2.2', date: '2026-03-04', title: 'Folder Backup & Security',
    items: [
      'Auto-backup to a local folder (Proton Drive, Dropbox, NAS, etc.)',
      'Writes getbased-backup-latest.json + daily dated snapshots',
      'Periodic nudge reminds you to download a backup (every 30 days)',
      'Stronger passphrase requirements for encryption (8+ chars, mixed case, special)',
      'Live strength meter with rule checklist in encryption setup',
    ]
  },
  {
    version: '1.2.1', date: '2026-03-03', title: 'Export Upgrade',
    items: [
      'Per-client export from the Client List \u22ee menu',
      'Export All Clients \u2014 full database backup from Client List or Settings',
      'Exports include chat history, threads, and custom personalities',
      'Database bundle import with auto-merge across browsers',
    ]
  },
  {
    version: '1.2.0', date: '2026-03-03', title: 'Client Management',
    items: [
      'Client List modal \u2014 search, sort, filter, and manage all profiles',
      'Profile tags, notes, status (active/flagged/archived), and pinning',
      'Full client form replaces prompt dialogs (name, sex, DOB, location, avatar)',
      'Compact header button with avatar dot opens Client List',
    ]
  },
  {
    version: '1.1.4', date: '2026-03-01', title: 'Diet & Digestion',
    items: [
      '10 new digestion fields on the Diet card (bowel, bloating, reflux, etc.)',
      'Digestive health included in AI context',
    ]
  },
  {
    version: '1.1.3', date: '2026-02-28', title: 'Encryption Nudge',
    items: [
      'One-time prompt to enable encryption after first PDF import',
    ]
  },
  {
    version: '1.1.2', date: '2026-02-28', title: 'Documentation Update',
    items: [
      'New Specialty Labs guide (OAT, DUTCH, HTMA)',
      'Updated 6 guide pages with latest features',
    ]
  },
  {
    version: '1.1.1', date: '2026-02-28', title: 'Model Guidance',
    items: [
      'Model dropdowns split into Recommended / Other tiers',
      'Active model shown in chat header with per-message cost',
      'Cross-provider model mismatch warning fixed',
    ]
  },
  {
    version: '1.1.0', date: '2026-02-28', title: 'Specialty Labs & Brand Refresh',
    items: [
      'Specialty lab support (beta) \u2014 OAT, amino acids, fatty acids, toxic elements',
      'Brand refresh \u2014 getbased gradient wordmark, SVG icons, cleaner layout',
      'Batch import auto-retry and single dashboard refresh',
      'Ollama PII obfuscation now opt-in (Settings \u2192 Privacy)',
      '\u20bf Donate button in header',
    ]
  },
  {
    version: '1.0.5', date: '2026-02-27', title: 'One-Click OpenRouter',
    items: [
      'One-click OAuth connect \u2014 no more copying API keys',
      'OpenRouter is now the default provider tab',
    ]
  },
  {
    version: '1.0.4', date: '2026-02-27', title: 'Simplified First Visit',
    items: [
      'Welcome hero with drop zone and demo data',
      'Context cards collapsed by default for new users',
    ]
  },
  {
    version: '1.0.3', date: '2026-02-27', title: 'Chat Improvements',
    items: [
      'Floating chat bubble \u2014 always one tap away',
      'Setup guide when no API key is configured',
    ]
  },
  {
    version: '1.0.2', date: '2026-02-27', title: 'Pre-Lab Onboarding',
    items: [
      'No lab data? Fill context cards and get personalized test recommendations',
      'Chat prompts adapt to your state (pre-lab, onboarding, analysis)',
      'Health dots work on context alone, even without lab results',
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
      'AI-powered PDF import \u2014 any lab report, any language',
      '287+ biomarkers across 26 categories with interactive charts',
      'AI chat with customizable personalities',
      'Menstrual cycle-aware interpretation with phase-specific ranges',
      '9 lifestyle context cards that shape AI analysis',
      'Fully private \u2014 all data stays in your browser',
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
    html += `<div class="changelog-entry">`;
    html += `<div class="changelog-header"><span class="changelog-version">v${escapeHTML(entry.version)} — ${escapeHTML(entry.title)}</span><span class="changelog-date">${escapeHTML(entry.date)}</span></div>`;
    html += '<ul class="changelog-items">';
    for (const item of entry.items) {
      html += `<li class="changelog-item">${escapeHTML(item)}</li>`;
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
