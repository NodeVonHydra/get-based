# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Get Based is a blood work dashboard for tracking biomarker trends over time. It visualizes lab results across 16 standard categories (biochemistry, hormones, lipids, hematology, etc.) with Chart.js line charts, data tables, and a correlation viewer. The app starts empty and is fully data-driven — users load their data via AI-powered PDF import (any lab report) or JSON files. Specialty labs (OAT, amino acids, toxic elements, etc.) flow through the custom marker pipeline — each user gets their own lab's stated reference ranges from their PDF.

Uses AI APIs (Anthropic Claude, OpenRouter, Venice, or local Ollama) for AI-powered PDF import and an AI chat panel for interpreting results. (Routstr provider disabled pending CORS fix — see `grep -r "ROUTSTR DISABLED"`)

## Architecture

No build system, no bundler, no package manager. Native ES modules (`<script type="module">`).

- **`index.html`** — HTML structure only (header, sidebar, modals with `role="dialog"`, chat panel, script/CSS includes with SRI hashes)
- **`styles.css`** — all CSS (dark/light themes, responsive layout with 10 breakpoints, touch/hover media queries)
- **`js/`** — 25 ES modules loaded via `js/main.js`:
  - `schema.js` — `MARKER_SCHEMA`, `SPECIALTY_MARKER_DEFS` (migration), `UNIT_CONVERSIONS`, `OPTIMAL_RANGES`, `PHASE_RANGES`, `CHIP_COLORS`, `MODEL_PRICING`
  - `constants.js` — option arrays, `CHAT_PERSONALITIES`, `CHAT_SYSTEM_PROMPT`, fake data, `COUNTRY_LATITUDES`
  - `state.js` — single mutable `state` object (importedData, unitSystem, profileSex, etc.)
  - `utils.js` — `escapeHTML`, `hashString`, `getStatus`, `formatValue`, `showNotification`, `showConfirmDialog`, `linearRegression`
  - `theme.js` — theme get/set/toggle, `getChartColors`, time format functions
  - `api.js` — all 4 AI providers + `callClaudeAPI` router, `callOpenAICompatibleAPI` shared helper, key/model management, dynamic model lists, OpenRouter OAuth PKCE
  - `profile.js` — profile CRUD, sex/DOB/location, `migrateProfileData`, profile dropdown
  - `data.js` — `getActiveData`, unit conversion, date range filtering, `saveImportedData`, `buildMarkerReference`
  - `pii.js` — regex + Ollama PII obfuscation, diff viewer
  - `charts.js` — Chart.js plugins (4), `createLineChart`, `destroyAllCharts`
  - `notes.js` — note editor (open/save/delete)
  - `supplements.js` — supplement editor + render section
  - `cycle.js` — menstrual cycle helpers + editor + render section
  - `context-cards.js` — 9 context card editors, shared helpers, summaries, health dots, interpretive lens
  - `pdf-import.js` — PDF pipeline, batch import, import preview, drop zone. AI detects test type and uses prefixed categories for specialty labs
  - `export.js` — JSON export/import, PDF report, `clearAllData`
  - `chat.js` — chat panel, `buildLabContext`, markdown rendering, personalities, per-marker AI
  - `settings.js` — settings modal, provider panels, privacy section
  - `glossary.js` — marker glossary modal
  - `feedback.js` — feedback modal (bug reports, feature requests)
  - `tour.js` — first-visit guided tour (spotlight walkthrough) + cycle tour
  - `changelog.js` — What's New modal, auto-trigger on update (uses `window.APP_VERSION` from `/version.js`)
  - `nav.js` — sidebar (with collapsible test-type groups), date range filter, chart layers
  - `views.js` — `navigate`, dashboard, category, compare, correlations, detail modal, manual entry, focus card, onboarding
  - `main.js` — `DOMContentLoaded` init, OAuth callback, event listeners, refresh callback
- **`data/`** — `seed-data.json`, `demo-female.json`, `demo-male.json`
- **`tests/`** — 15 browser-based test files (`test-*.js`) + `verify-modules.js`

Functions called from inline HTML `onclick` handlers are exposed via `Object.assign(window, {...})` at the bottom of each module. Cross-module calls use `window.fn()` to avoid circular dependencies.

### Data Flow

1. `getActiveData()` is the central data pipeline: deep-clones `MARKER_SCHEMA` → collects all dates from `importedData.entries` → populates `values` arrays → calculates ratios and PhenoAge → applies unit conversion if US mode
2. All data lives in `importedData` in `localStorage` under key `labcharts-{profileId}-imported`; structure: `{ entries, notes, diagnoses, diet, exercise, sleepRest, lightCircadian, stress, loveLife, environment, interpretiveLens, healthGoals, contextNotes, menstrualCycle, customMarkers, supplements }`. Legacy fields auto-migrated via `migrateProfileData()`
3. Marker values are arrays aligned with the `dates` array; `null` = no result for that date
4. `singlePoint` categories (fattyAcids) have `singlePoint: true` — grid cards instead of trend charts
5. Charts use `spanGaps: true` to draw lines across dates where a marker has no data

### PDF Import Pipeline

1. **Text extraction** (`extractPDFText`): pdf.js extracts text items with x, y coordinates, grouped by page
2. **PII obfuscation**: Ollama (preferred) or regex fallback replaces personal info before sending to AI
3. **AI analysis** (`parseLabPDFWithAI`): sends text + `buildMarkerReference()` to AI. AI detects `testType` (blood/OAT/DUTCH/HTMA/GI/other), maps results to `category.markerKey` format, uses test-type-prefixed categories for specialty labs
4. **Import preview**: matched/unmatched/new markers shown; user confirms before saving
5. **Custom markers**: unknown markers auto-handled — AI suggests key, name, unit, ref ranges, group. Stored in `importedData.customMarkers` with `group` field, merged into pipeline at runtime. Existing specialty data auto-migrated via `SPECIALTY_MARKER_DEFS` in `migrateProfileData()`
6. **Batch import**: `handleBatchPDFs()` processes multiple PDFs sequentially with per-file confirm/skip
7. **Sidebar grouping**: categories with `group` field (e.g., "OAT") render under collapsible sidebar headers. `toggleNavGroup()`, collapse state persisted in localStorage

### Profile Context Cards

Nine cards stored as structured objects in `importedData`. Editors use `.ctx-btn-group`/`.ctx-btn-option` pill buttons with multi-select tag pills. Cards: Health Goals, Medical Conditions, Diet, Exercise, Sleep & Rest, Light & Circadian, Stress, Love Life & Relationships, Environment. Each has AI health dot (green/yellow/red) + tip, cached per-card via fingerprint.

- `buildLabContext()` serializes all 9 areas + interpretiveLens + contextNotes to AI context
- `hasCardContent(obj)` gates empty cards from AI context
- All fields included in JSON export/import and PDF report
- See source for exact data structures per card

### Menstrual Cycle Tracking

Female profiles only (`profileSex === 'female'`). Storage: `importedData.menstrualCycle`. Features: phase-aware reference ranges (`PHASE_RANGES` for estradiol/progesterone), cycle phase bands on charts (`phaseBandPlugin`), auto-calculated stats from period log, perimenopause detection, heavy flow + iron alerts. All included in AI context. See `cycle.js` and `data.js` for algorithms.

### Calculated Markers

- **Free Water Deficit**: `FWD = TBW × (Na / 140 − 1)`, requires sodium
- **PhenoAge**: Levine et al. 2018 — 9 biomarkers + chronological age. `refMin/refMax: null` — meaningful relative to chronological age

### AI Chat Panel

Slide-out panel with streaming responses. Features: markdown rendering, 2 built-in personalities (default, House) + unlimited custom (`custom_<id>`), stop button (abort streaming), discuss button (auto-alternate personas), conversation threads (50 max, stored per-profile). Chat setup guide shows when no provider configured — includes OpenRouter OAuth button.

Context: `buildLabContext()` serializes all user data in priority order (goals→lens→values→flags→notes→conditions→supps→cycle→lifestyle). Focus card uses lightweight `buildFocusContext()`.

### AI Provider System

Four active backends. Provider stored in `labcharts-ai-provider`. `callClaudeAPI(opts)` routes to the active provider. `hasAIProvider()` gates all AI features.

- **OpenRouter** (recommended, first tab): OpenAI-compatible marketplace, 200+ models. `callOpenAICompatibleAPI` with attribution headers. Curated model whitelist (`OPENROUTER_CURATED`) + exclusion list. Dynamic pricing cached from API. **OAuth PKCE**: `generatePKCE()` + `startOpenRouterOAuth()` + `exchangeOpenRouterCode()` for one-click connect. `main.js` handles `?code=` callback. Button in Settings + chat setup guide. Constraint: callback must be HTTPS or `http://localhost:3000`
- **Anthropic**: Messages API + SSE streaming. Key: `labcharts-api-key`
- **Venice**: OpenAI-compatible via shared helper. Key: `labcharts-venice-key`
- **Ollama**: `/api/chat` + newline-delimited JSON streaming. Local only
- **Routstr**: Disabled — all code commented with `ROUTSTR DISABLED` markers

### Dashboard Section Order

**Has data**: Drop zone → Onboarding Banner → Interpretive Lens → Focus Card → Context Cards → Menstrual Cycle (female) → Supplements → Key Trends + charts → Trends & Alerts → Data & Notes + Export.
**Empty state**: Welcome hero (drop zone + demo cards) → collapsed context cards.

### Other Features

- **Trend alerts**: `detectTrendAlerts()` — sudden change (>25% ref range jump) + linear regression (slope/R² thresholds)
- **Marker glossary**: searchable modal, all markers grouped by category with values and ranges
- **Guided tours**: 7-step app tour (auto on first visit) + 8-step cycle tour. Generic engine: `runTour(steps, storageKey, auto)`
- **What's New modal**: `CHANGELOG` array in changelog.js. `APP_VERSION` in `/version.js` — single source of truth for app + SW cache. Patch bumps skip What's New; minor/major show it
- **Chart layers**: single dropdown controlling note dots, supplement bars, cycle phase bands. Persisted per-profile
- **Onboarding**: welcome hero → profile banner → completion toast. Pre-lab path: no-data context assembly, context-aware chat prompts

## Development

```
node dev-server.js
```
Dev server mirrors production routing. Landing page repo (`../get-based-site`) served at `/` when present, app at `/app`. Docs at `/docs/*` route to `dist-docs/`.

### Tests

15 browser-based test files run headlessly:
```
./run-tests.sh
```
Auto-starts server, runs all tests via Puppeteer, exits 0/1.

### Documentation Site

VitePress at `/docs` (source in `docs/`). 27 user guide pages + 8 contributor pages. Build: `npm run docs:build`. Vercel deploys to `/dist-docs/`.

### PWA

`manifest.json` + `service-worker.js`. Cache: `labcharts-v${APP_VERSION}`. Bump `version.js` to bust cache. AI API calls bypass SW entirely (avoids IPC stream buffering).

### Responsive Layout

Breakpoints: 3000/2000/1600/1400px (chat scaling), 1200px (cards 3→2 col), 1024px (sidebar → horizontal pills), 768px (compact header), 600/480/375px (mobile). Grid items: `min-width: 0; overflow: hidden`. Touch: `@media (pointer: coarse)` 44px tap targets; `@media (hover: none)` reveals hover-only elements.

## Key Patterns

- **Status**: `getStatus()` → `"normal"`, `"high"`, `"low"`, `"missing"`. Returns `"normal"` when refs are `null`
- **Theme**: Dark (default) / light. CSS vars in `:root`, overridden in `[data-theme="light"]`
- **Performance**: rendering functions accept optional `data` param to avoid redundant `getActiveData()` calls
- **Chart.js plugins**: `refBandPlugin`, `optimalBandPlugin`, `noteAnnotationPlugin`, `supplementBarPlugin`, `phaseBandPlugin`
- **Streaming**: SSE via `callClaudeAPI({ onStream })`
- **Security**: `escapeHTML(str)` for all innerHTML. Markdown URLs validated to http/https/mailto
- **Marker keys**: `category.markerKey` format (e.g., `biochemistry.glucose`) used everywhere
- **Debug**: `isDebugMode()` gates console output. Toggled in Settings → Privacy
- **Design system**: `--accent-gradient`, `--shadow-lg`/`--shadow-glow`, `.ctx-btn-group`/`.ctx-btn-option` pill buttons
