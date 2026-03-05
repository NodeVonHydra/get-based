import{_ as a,o as n,c as e,ag as p}from"./chunks/framework.BYehg5q7.js";const u=JSON.parse('{"title":"Architecture","description":"","frontmatter":{},"headers":[],"relativePath":"contributor/architecture.md","filePath":"contributor/architecture.md","lastUpdated":1772692870000}'),i={name:"contributor/architecture.md"};function t(l,s,r,o,c,d){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="architecture" tabindex="-1">Architecture <a class="header-anchor" href="#architecture" aria-label="Permalink to &quot;Architecture&quot;">​</a></h1><h2 id="zero-build-philosophy" tabindex="-1">Zero-build philosophy <a class="header-anchor" href="#zero-build-philosophy" aria-label="Permalink to &quot;Zero-build philosophy&quot;">​</a></h2><p>getbased has no bundler, no package manager, and no compile step. It uses native ES modules (<code>&lt;script type=&quot;module&quot;&gt;</code>) supported by every modern browser. The development workflow is:</p><ol><li>Edit a file</li><li>Reload the browser</li></ol><p>That is the entire build process. There is nothing else.</p><p>This constraint is intentional — it keeps the codebase approachable, removes tooling churn, and makes every file human-readable as shipped.</p><h2 id="file-layout" tabindex="-1">File layout <a class="header-anchor" href="#file-layout" aria-label="Permalink to &quot;File layout&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>index.html          — HTML structure only; script/CSS includes with SRI hashes; SEO meta tags</span></span>
<span class="line"><span>styles.css          — All CSS: dark/light themes, 10 responsive breakpoints, all components</span></span>
<span class="line"><span>manifest.json       — PWA manifest (installable as a native app)</span></span>
<span class="line"><span>service-worker.js   — PWA cache strategies, API bypass rules</span></span>
<span class="line"><span>data/</span></span>
<span class="line"><span>  seed-data.json    — Baseline importable JSON with 4 lab entries</span></span>
<span class="line"><span>  demo-female.json  — Female demo profile (Sarah)</span></span>
<span class="line"><span>  demo-male.json    — Male demo profile (Alex)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tests/</span></span>
<span class="line"><span>  test-*.js         — 17 browser-based test files</span></span>
<span class="line"><span>  verify-modules.js — Module integrity assertions</span></span>
<span class="line"><span></span></span>
<span class="line"><span>js/</span></span>
<span class="line"><span>  main.js           — Entry point: DOMContentLoaded init, global event listeners</span></span>
<span class="line"><span>  schema.js         — MARKER_SCHEMA, UNIT_CONVERSIONS, OPTIMAL_RANGES, PHASE_RANGES</span></span>
<span class="line"><span>  constants.js      — Option arrays, CHAT_PERSONALITIES, fake data, COUNTRY_LATITUDES</span></span>
<span class="line"><span>  state.js          — Single shared mutable state object</span></span>
<span class="line"><span>  utils.js          — escapeHTML, hashString, getStatus, formatValue, showNotification, linearRegression</span></span>
<span class="line"><span>  theme.js          — Theme get/set/toggle, getChartColors, time format helpers</span></span>
<span class="line"><span>  api.js            — AI provider routing, all 4 providers, model management</span></span>
<span class="line"><span>  profile.js        — Profile CRUD, sex/DOB/location, migrateProfileData, profile dropdown</span></span>
<span class="line"><span>  data.js           — getActiveData() pipeline, unit conversion, date range, saveImportedData</span></span>
<span class="line"><span>  pii.js            — PII obfuscation: local AI (OpenAI-compatible) + regex fallback, diff viewer</span></span>
<span class="line"><span>  charts.js         — Chart.js plugins (5), createLineChart, destroyAllCharts</span></span>
<span class="line"><span>  notes.js          — Note editor: open/save/delete</span></span>
<span class="line"><span>  supplements.js    — Supplement editor and rendering</span></span>
<span class="line"><span>  cycle.js          — Menstrual cycle helpers, editor, dashboard rendering</span></span>
<span class="line"><span>  context-cards.js  — 9 context card editors, health dots, AI tips, summaries</span></span>
<span class="line"><span>  pdf-import.js     — PDF pipeline, batch import, import preview, drop zone</span></span>
<span class="line"><span>  export.js         — JSON export/import (single, per-client, database bundle), PDF report, clearAllData</span></span>
<span class="line"><span>  chat.js           — Chat panel, buildLabContext, markdown, personalities, per-marker AI</span></span>
<span class="line"><span>  client-list.js    — Client List modal: search/sort/filter profiles, inline CRUD, archive/flag/pin</span></span>
<span class="line"><span>  recommendations.js — Supplement &amp; lifestyle recommendations, lazy catalog, 3 touchpoints</span></span>
<span class="line"><span>  settings.js       — Settings modal: profile, display, AI providers, privacy, security, backup</span></span>
<span class="line"><span>  glossary.js       — Marker glossary modal</span></span>
<span class="line"><span>  feedback.js       — Feedback modal (bug reports, feature requests)</span></span>
<span class="line"><span>  tour.js           — Guided tour spotlight engine (app tour + cycle tour)</span></span>
<span class="line"><span>  nav.js            — Sidebar, date range filter, chart layers dropdown</span></span>
<span class="line"><span>  views.js          — navigate(), dashboard, category views, modals, manual entry, onboarding</span></span>
<span class="line"><span>  crypto.js         — AES-256-GCM encryption, IndexedDB auto-backup, folder backup, backup restore</span></span></code></pre></div><h2 id="entry-point" tabindex="-1">Entry point <a class="header-anchor" href="#entry-point" aria-label="Permalink to &quot;Entry point&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>index.html</span></span>
<span class="line"><span>  └── &lt;script type=&quot;module&quot; src=&quot;js/main.js&quot;&gt;</span></span>
<span class="line"><span>        └── imports all other modules (directly or transitively)</span></span></code></pre></div><p><code>main.js</code> registers the <code>DOMContentLoaded</code> listener, attaches global keyboard and event handlers, and calls the initial <code>navigate()</code> to render the dashboard.</p><h2 id="_6-layer-dependency-graph" tabindex="-1">6-layer dependency graph <a class="header-anchor" href="#_6-layer-dependency-graph" aria-label="Permalink to &quot;6-layer dependency graph&quot;">​</a></h2><p>Modules in a higher layer may import from lower layers. Modules in the same layer must not import from each other — cross-layer calls within the same layer use <code>window.fn()</code> to avoid circular dependencies.</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>┌─────────────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  L1 — Foundation                                                    │</span></span>
<span class="line"><span>│  schema.js   constants.js   state.js   utils.js                    │</span></span>
<span class="line"><span>└────────────────────────────────┬────────────────────────────────────┘</span></span>
<span class="line"><span>                                 │</span></span>
<span class="line"><span>                                 ▼</span></span>
<span class="line"><span>┌─────────────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  L2 — Core Services                                                 │</span></span>
<span class="line"><span>│  theme.js   api.js                                                  │</span></span>
<span class="line"><span>└────────────────────────────────┬────────────────────────────────────┘</span></span>
<span class="line"><span>                                 │</span></span>
<span class="line"><span>                                 ▼</span></span>
<span class="line"><span>┌─────────────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  L3 — Data &amp; Profile                                                │</span></span>
<span class="line"><span>│  profile.js   data.js   pii.js                                     │</span></span>
<span class="line"><span>└────────────────────────────────┬────────────────────────────────────┘</span></span>
<span class="line"><span>                                 │</span></span>
<span class="line"><span>                                 ▼</span></span>
<span class="line"><span>┌─────────────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  L4 — Domain Modules                                                │</span></span>
<span class="line"><span>│  charts.js   notes.js   supplements.js   cycle.js   context-cards.js│</span></span>
<span class="line"><span>└────────────────────────────────┬────────────────────────────────────┘</span></span>
<span class="line"><span>                                 │</span></span>
<span class="line"><span>                                 ▼</span></span>
<span class="line"><span>┌─────────────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  L5 — Feature Modules                                               │</span></span>
<span class="line"><span>│  pdf-import.js  export.js  chat.js  settings.js  glossary.js       │</span></span>
<span class="line"><span>│  feedback.js    nav.js                                              │</span></span>
<span class="line"><span>└────────────────────────────────┬────────────────────────────────────┘</span></span>
<span class="line"><span>                                 │</span></span>
<span class="line"><span>                                 ▼</span></span>
<span class="line"><span>┌─────────────────────────────────────────────────────────────────────┐</span></span>
<span class="line"><span>│  L6 — Orchestration                                                 │</span></span>
<span class="line"><span>│  views.js   main.js   tour.js   changelog.js                       │</span></span>
<span class="line"><span>└─────────────────────────────────────────────────────────────────────┘</span></span></code></pre></div><h3 id="circular-dependency-avoidance" tabindex="-1">Circular dependency avoidance <a class="header-anchor" href="#circular-dependency-avoidance" aria-label="Permalink to &quot;Circular dependency avoidance&quot;">​</a></h3><p>The main tension is between <code>views.js</code> (which renders everything) and modules like <code>data.js</code> and <code>charts.js</code> (which views depend on but which also need to trigger re-renders). Two mechanisms break cycles:</p><p><strong><code>registerRefreshCallback(fn)</code> in <code>data.js</code></strong> — <code>main.js</code> registers the refresh function after init, so <code>data.js</code> can trigger re-renders without importing <code>views.js</code>:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// main.js</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { registerRefreshCallback } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;./data.js&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">registerRefreshCallback</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> window.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">refreshDashboard</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">());</span></span></code></pre></div><p><strong><code>window.fn()</code> calls</strong> — functions exposed via <code>Object.assign(window, {...})</code> are callable from any module without creating an import edge:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// cycle.js can call views.js functions without importing views.js</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">window.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">showDashboard</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span></code></pre></div><h2 id="external-dependencies" tabindex="-1">External dependencies <a class="header-anchor" href="#external-dependencies" aria-label="Permalink to &quot;External dependencies&quot;">​</a></h2><p>Loaded from CDN with SRI integrity hashes in <code>index.html</code>:</p><table tabindex="0"><thead><tr><th>Library</th><th>Version</th><th>Purpose</th></tr></thead><tbody><tr><td>Chart.js</td><td>4.4.7</td><td>Line charts, bar charts</td></tr><tr><td>pdf.js</td><td>3.11.174</td><td>PDF text extraction</td></tr><tr><td>Inter, Outfit, JetBrains Mono</td><td>latest</td><td>Google Fonts (body, headings, data)</td></tr></tbody></table><p>AI providers (Anthropic, OpenRouter, Venice, Local AI) are called directly from the browser — no backend proxy.</p>`,24)])])}const g=a(i,[["render",t]]);export{u as __pageData,g as default};
