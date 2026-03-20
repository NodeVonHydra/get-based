# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

getbased is a blood work dashboard for tracking biomarker trends over time. It visualizes lab results across 15 standard categories (biochemistry, hormones, lipids, hematology, etc.) with Chart.js line charts, data tables, and a correlation viewer. The app starts empty and is fully data-driven — users load their data via AI-powered PDF import (any lab report) or JSON files. Specialty labs (OAT, fatty acids, etc.) flow through the custom marker pipeline — each user gets their own lab's stated reference ranges from their PDF. Fatty acid tests are grouped by product/lab (Spadia, ZinZino, OmegaQuant) under a "Fatty Acids" sidebar group.

Uses AI APIs (Anthropic Claude, OpenRouter, Venice, or Local AI) for AI-powered PDF import and an AI chat panel for interpreting results. (Routstr provider disabled pending CORS fix — see `grep -r "ROUTSTR DISABLED"`)

## Architecture

No build system, no bundler, no package manager. Native ES modules (`<script type="module">`).

- **`BRAND.md`** — brand manual (name rules, colors, typography, voice). Brand name is always `getbased` — lowercase, no space
- **`index.html`** — HTML structure only (header, sidebar, modals with `role="dialog"`, chat panel, script/CSS includes)
- **`styles.css`** — all CSS (dark/light themes, responsive layout with 10 breakpoints, touch/hover media queries)
- **`js/`** — 33 ES modules loaded via `js/main.js`:
  - `schema.js` — `MARKER_SCHEMA`, `SPECIALTY_MARKER_DEFS` (re-exported from adapters.js), `UNIT_CONVERSIONS`, `OPTIMAL_RANGES`, `PHASE_RANGES`, `CHIP_COLORS`, `MODEL_PRICING`, `SBM_2015_THRESHOLDS`, `getEMFSeverity`, `trackUsage`, `getProfileUsage`, `getGlobalUsage`
  - `adapters.js` — parser adapter registry for specialty labs. `ADAPTER_MARKERS` (194 entries), `detectProduct`, `normalizeWithAdapter`, `getAdapterByTestType`. Adapters: fattyAcids (29 markers, product detection), metabolomix (FA routing), oat (165 markers)
  - `constants.js` — option arrays, `CHAT_PERSONALITIES`, `CHAT_SYSTEM_PROMPT`, fake data, `COUNTRY_LATITUDES`, `EMF_ROOM_PRESETS`, `EMF_SOURCES`, `EMF_MITIGATIONS`
  - `state.js` — single mutable `state` object (importedData, unitSystem, profileSex, etc.)
  - `utils.js` — `escapeHTML`, `hashString`, `getStatus`, `formatValue`, `showNotification`, `showConfirmDialog`, `linearRegression`
  - `theme.js` — theme get/set/toggle, `getChartColors`, time format functions
  - `hardware.js` — GPU detection (WebGL renderer → GPU_DB), `detectHardware`, `assessModel` (fits/tight/toobig/cloud), `getModelSuggestions`, VRAM override. Ollama Cloud `:cloud` models recognized (no VRAM needed)
  - `image-utils.js` — `resizeImage`, `formatImageBlock`, `buildVisionContent`, `isValidImageType` (no app imports)
  - `api.js` — all 4 AI providers + `callClaudeAPI` router, `callOpenAICompatibleAPI` shared helper, key/model management, dynamic model lists, OpenRouter OAuth PKCE, `isRecommendedModel()` tiering, `getActiveModelId/Display()` helpers, `supportsVision()`, `isAIPaused()`/`setAIPaused()` global AI toggle, Venice E2EE branch (`isE2EEModel`, `isVeniceE2EEActive`)
  - `venice-e2ee.js` — Venice E2EE crypto (ECDH secp256k1 via vendored `@noble/secp256k1` + HKDF-SHA256 + AES-256-GCM via Web Crypto). Session management with 30-min TTL, TEE attestation, per-chunk response decryption
  - `profile.js` — profile CRUD, sex/DOB/location, `migrateProfileData`, `migrateProfiles`, `updateProfileMeta`, `getAllTags`, `touchProfileTimestamp`
  - `data.js` — `getActiveData`, unit conversion, date range filtering, `saveImportedData`, `buildMarkerReference`
  - `pii.js` — regex + local AI PII obfuscation (Ollama & OpenAI-compatible), streaming sanitizer, diff viewer
  - `charts.js` — Chart.js plugins (4), `createLineChart`, `destroyAllCharts`
  - `notes.js` — note editor (open/save/delete)
  - `supplements.js` — supplement editor + render section
  - `cycle.js` — menstrual cycle helpers + editor + render section
  - `context-cards.js` — 9 context card editors, shared helpers, summaries, health dots, interpretive lens, `recordChange()` for change history
  - `emf.js` — Baubiologie EMF assessment editor, room CRUD, SBM-2015 severity, PDF import for consultant reports
  - `pdf-import.js` — PDF pipeline, batch import, import preview (with per-row exclude), import FAB, auto image mode for scanned PDFs, direct image import (JPG/PNG/WebP). AI detects test type and uses prefixed categories for specialty labs
  - `export.js` — JSON export/import (single-profile, per-client, full database bundle), PDF report, `clearAllData`, `buildAllDataBundle`
  - `chat.js` — chat panel, `buildLabContext`, markdown rendering, personalities, per-marker AI, image attachments
  - `settings.js` — settings modal, provider panels, privacy section
  - `glossary.js` — marker glossary modal
  - `feedback.js` — feedback modal (bug reports, feature requests)
  - `tour.js` — guided tour (spotlight walkthrough, auto-triggers after first data import) + cycle tour
  - `changelog.js` — What's New modal, auto-trigger on update (uses `window.APP_VERSION` from `/version.js`)
  - `client-list.js` — Client List modal (search/sort/filter profiles, inline create/edit form, archive/flag/pin/delete)
  - `nav.js` — sidebar (with collapsible test-type groups), compact profile button, avatar colors
  - `views.js` — `navigate`, dashboard, category, compare, correlations, detail modal, manual entry, create custom marker, focus card, onboarding, emoji picker, category rename/icon editing, marker rename/revert, calculated marker input diagnostics
  - `main.js` — `DOMContentLoaded` init, OAuth callback, event listeners, refresh callback
- **`vendor/`** — locally bundled Chart.js, pdf.js (+worker), Google Fonts (woff2), noble-secp256k1 v1.7.1 (Venice E2EE). Run `./update-vendor.sh` to update
- **`data/`** — `seed-data.json`, `demo-female.json`, `demo-male.json`, `emf-assessment-template.html`
- **`tests/`** — 26 browser-based test files (`test-*.js`) + `verify-modules.js`

Functions called from inline HTML `onclick` handlers are exposed via `Object.assign(window, {...})` at the bottom of each module. Cross-module calls use `window.fn()` to avoid circular dependencies.

### Data Flow

1. `getActiveData()` is the central data pipeline: deep-clones `MARKER_SCHEMA` → collects all dates from `importedData.entries` → populates `values` arrays → calculates ratios and PhenoAge → applies unit conversion if US mode
2. All data lives in `importedData` in `localStorage` under key `labcharts-{profileId}-imported`; structure: `{ entries, notes, diagnoses, diet, exercise, sleepRest, lightCircadian, stress, loveLife, environment, interpretiveLens, healthGoals, contextNotes, menstrualCycle, customMarkers, supplements, refOverrides, emfAssessment, markerNotes, changeHistory }`. Legacy fields auto-migrated via `migrateProfileData()`
3. `refOverrides` stores user-customized reference/optimal ranges per marker (`{ "category.marker": { refMin, refMax, optimalMin, optimalMax, labRefMin, labRefMax, refSource } }`). Applied in `getActiveData()` after schema defaults. Set via detail modal editing or import-time range adoption toggle. Two-step revert: manual edit → lab range → schema default. `categoryLabels` and `categoryIcons` override display names/icons per category. `markerLabels` overrides individual marker display names (same dot-key format). `markerNotes` stores per-marker freeform notes (`{ "category.marker": "text" }`), shown in detail modal and included in AI context
3b. `changeHistory` is a capped (200) array of `{ field, date, snapshot }` entries, recording timestamped snapshots of context field changes (13 fields: 9 context cards + healthGoals + interpretiveLens + contextNotes + menstrualCycle). `recordChange(field)` in context-cards.js handles dedup (same-day overwrite, identical-snapshot skip). Included in `buildLabContext()` as a diff timeline so the AI can reason about temporal correlations
4. Marker values are arrays aligned with the `dates` array; `null` = no result for that date
5. `singlePoint` categories have `singlePoint: true` — grid cards instead of trend charts. Fatty acids flow through the custom marker pipeline with per-product prefixes (spadiaFA, zinzinoFA, omegaquantFA) under a "Fatty Acids" sidebar group
6. Charts use `spanGaps: true` to draw lines across dates where a marker has no data

### PDF Import Pipeline

1. **Text extraction** (`extractPDFText`): pdf.js extracts text items with x, y coordinates, grouped by page
2. **PII obfuscation**: When review enabled + Local AI available, modal opens immediately and streams AI obfuscation in real-time (`sanitizeWithOllamaStreaming`). "Use regex instead" button as explicit fallback. Without review, non-streaming `sanitizeWithOllama` with silent regex fallback. Without Local AI, regex-only
3. **AI analysis** (`parseLabPDFWithAI`): sends text + `buildMarkerReference()` to AI. AI detects `testType` (blood/OAT/DUTCH/HTMA/GI/other), maps results to `category.markerKey` format, uses test-type-prefixed categories for specialty labs. Strips specimen-type prefixes (S-, U-, USED-, F-, FW). Every numeric result must be included — unknowns become custom markers. CRP/hs-CRP distinguished by name. Below-detection-limit values (`<X`) imported as X
4. **Import preview**: matched/unmatched/new markers shown; user confirms before saving
5. **Custom markers**: unknown markers auto-handled — AI suggests key, name, unit, ref ranges, group. Stored in `importedData.customMarkers` with `group` field, merged into pipeline at runtime. Users can also create custom markers manually via sidebar "+" button (`openCreateMarkerModal`). Existing specialty data auto-migrated via `SPECIALTY_MARKER_DEFS` in `migrateProfileData()`
6. **Batch import**: `handleBatchPDFs()` processes multiple PDFs sequentially with per-file confirm/skip
7. **Sidebar grouping**: categories with `group` field (e.g., "OAT") render under collapsible sidebar headers. `toggleNavGroup()`, collapse state persisted in localStorage
8. **Import status FAB**: pill-shaped indicator appears when progress bar scrolls out of view or user navigates away. IntersectionObserver on dashboard progress bar. Hidden when import preview modal is open. Import blocked while another is running

### Profile Context Cards

Nine cards stored as structured objects in `importedData`. Editors use `.ctx-btn-group`/`.ctx-btn-option` pill buttons with multi-select tag pills. Cards: Health Goals, Medical Conditions, Diet & Digestion, Exercise, Sleep & Rest, Light & Circadian, Stress, Love Life & Relationships, Environment. Each has AI health dot (green/yellow/red) + tip, cached per-card via fingerprint.

- `buildLabContext()` serializes all 9 areas + interpretiveLens + contextNotes + EMF assessment to AI context
- `hasCardContent(obj)` gates empty cards from AI context
- All fields included in JSON export/import and PDF report
- See source for exact data structures per card

### Menstrual Cycle Tracking

Female profiles only. Phase-aware reference ranges (`PHASE_RANGES`), cycle phase bands on charts, perimenopause detection, iron alerts. See `cycle.js`.

### EMF Assessment

Baubiologie sub-module under Environment card. Room-by-room measurements with SBM-2015 severity, source/mitigation tags, AI interpretation. See `emf.js`.

### Calculated Markers

Free Water Deficit (sodium-based), BUN/Creatinine Ratio (US-unit conversion), PhenoAge (Levine 2018, 9 biomarkers + age, requires hs-CRP). See `data.js` for formulas.

### AI Chat Panel

Slide-out panel with streaming. 2+custom personalities, stop/discuss buttons, conversation threads (50 max), image attachments (vision-gated), web search hints (3 states: active/available/E2EE). `buildLabContext()` serializes all user data in priority order. Focus card uses `buildFocusContext()`.

### AI Provider System

Four active backends. Provider stored in `labcharts-ai-provider`. `callClaudeAPI(opts)` routes to the active provider. `hasAIProvider()` gates all AI features. OpenRouter (recommended, OAuth PKCE), Anthropic, Venice (with optional E2EE — prompts encrypted client-side, decrypted in TEE), Local (Ollama/LM Studio/Jan — internal key `'ollama'`). Routstr disabled (`ROUTSTR DISABLED` markers). See `api.js` for details.

Venice E2EE: toggle in settings swaps model dropdown to `e2ee-*` models. `callVeniceAPI` auto-branches: encrypts all messages, adds `X-Venice-TEE-*` headers, decrypts streamed response chunks per-chunk via ECDH. Web search + vision disabled when E2EE active. Lock emoji in chat header, `🔒 e2ee` in message footer. Session has 30-min TTL.

### Dashboard Section Order

**Has data**: Onboarding Banner → Interpretive Lens → Focus Card → Context Cards → Menstrual Cycle (female) → Supplements → Key Trends + charts → Trends & Alerts → Data & Notes + Export. Import FAB (floating button, bottom-right above chat FAB) replaces the compact drop zone.
**Empty state**: Welcome hero (drop zone + demo cards) → collapsed context cards.

### Other Features

- **Trend alerts**: `detectTrendAlerts()` — sudden change (>25% ref range jump) + linear regression (slope/R² thresholds)
- **Marker glossary**: searchable modal, all markers grouped by category with values and ranges
- **Guided tours**: 7-step app tour (auto on first visit) + 8-step cycle tour. Generic engine: `runTour(steps, storageKey, auto)`
- **What's New modal**: `CHANGELOG` array in changelog.js. `APP_VERSION` in `/version.js` — single source of truth for app + SW cache. Patch bumps skip What's New; minor/major show it
- **Chart layers**: single dropdown controlling note dots, supplement bars, cycle phase bands. Persisted per-profile
- **Onboarding**: chat-driven 5-stage wizard (profile → API → extras → cards → has-data nudge). First-time visitors get auto-opened chat instead of guided tour. Per-profile state in localStorage. Pre-lab path: no-data context assembly, context-aware chat prompts

## Development

```
node dev-server.js
```
Dev server mirrors production routing. Landing page repo (`../get-based-site`) served at `/` when present, app at `/app`. Docs at `/docs/*` route to `dist-docs/`.

### Tests

26 browser-based test files run headlessly:
```
./run-tests.sh
```
Auto-starts server, runs all tests via Puppeteer, exits 0/1.

### Documentation Site

VitePress at `/docs` (source in `docs/`). 27 user guide pages + 8 contributor pages. Build: `npm run docs:build`. Vercel deploys to `/dist-docs/`.

### PWA

`manifest.json` + `service-worker.js`. Cache: `labcharts-v${APP_VERSION}`. Bump `version.js` to bust cache. AI API calls bypass SW entirely (avoids IPC stream buffering).

### Responsive Layout

Breakpoints: 3000/2000/1600/1400px (chat scaling), 1200px (cards 3→2 col), 1024px (sidebar → hamburger slide-out with backdrop), 768px (compact header — hides dates, range, feedback, donate; header groups with dividers), 600/480/375px (mobile). Grid items: `min-width: 0; overflow: hidden`. Touch: `@media (pointer: coarse)` 44px tap targets; `@media (hover: none)` reveals hover-only elements. Mobile sidebar: `toggleMobileSidebar()`/`closeMobileSidebar()` in nav.js, auto-closes on navigation.

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
