// changelog.js — What's New modal, version tracking, auto-trigger on update

import { escapeHTML } from './utils.js';

export const APP_VERSION = '1.0';

const CHANGELOG = [
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

function getSeenVersion() {
  return localStorage.getItem('labcharts-changelog-seen') || '';
}

function markChangelogSeen() {
  localStorage.setItem('labcharts-changelog-seen', String(APP_VERSION));
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
  if (getSeenVersion() !== String(APP_VERSION)) {
    openChangelog(false);
  }
}

Object.assign(window, { openChangelog, closeChangelog, maybeShowChangelog });
