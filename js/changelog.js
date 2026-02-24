// changelog.js — What's New modal, version tracking, auto-trigger on update

import { escapeHTML } from './utils.js';

export const APP_VERSION = 53;

const CHANGELOG = [
  {
    version: 53, date: '2026-02-24', title: 'Smarter Context & What\'s New',
    items: [
      'What\'s New — see what changed after each update (this modal!)',
      'Per-category staleness — AI flags old lab categories and recommends retesting',
      'Absent field awareness — AI understands unfilled fields vs intentional choices',
      'Auto-gating — all lifestyle card fields now properly included in AI context',
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
    html += `<h4 style="margin-top:16px;margin-bottom:6px;color:var(--text-primary)">v${entry.version} &mdash; ${escapeHTML(entry.date)}</h4>`;
    html += '<ul style="margin:0 0 12px 0;padding-left:20px">';
    for (const item of entry.items) {
      html += `<li style="margin-bottom:4px;color:var(--text-secondary);font-size:14px">${escapeHTML(item)}</li>`;
    }
    html += '</ul>';
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
