# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Get Based is a blood work dashboard for tracking biomarker trends over time. It visualizes lab results across 15 categories (biochemistry, hormones, lipids, hematology, etc.) with Chart.js line charts, data tables, and a correlation viewer. The app starts empty and is fully data-driven — users load their data via AI-powered PDF import (any lab report) or JSON files.

Uses AI APIs (Anthropic Claude, OpenRouter, Venice, or local Ollama) for AI-powered PDF import and an AI chat panel for interpreting results. (Routstr provider disabled pending CORS fix — see `grep -r "ROUTSTR DISABLED"`)

## Architecture

No build system, no bundler, no package manager. Native ES modules (`<script type="module">`).

- **`index.html`** — HTML structure only (header, sidebar, modals with `role="dialog"`, chat panel, script/CSS includes with SRI hashes, SEO meta tags)
- **`styles.css`** — all CSS (dark/light themes, responsive layout with 10 breakpoints, touch/hover media queries, modals, notifications, correlation view, chat panel, empty state)
- **`js/`** — 25 ES modules loaded via `js/main.js`:
  - `schema.js` — `MARKER_SCHEMA`, `UNIT_CONVERSIONS`, `OPTIMAL_RANGES`, `PHASE_RANGES`, `CHIP_COLORS`, `MODEL_PRICING`
  - `constants.js` — option arrays, `CHAT_PERSONALITIES`, `CHAT_SYSTEM_PROMPT`, fake data, `COUNTRY_LATITUDES`
  - `state.js` — single mutable `state` object (importedData, unitSystem, profileSex, etc.)
  - `utils.js` — `escapeHTML`, `hashString`, `getStatus`, `formatValue`, `showNotification`, `showConfirmDialog`, `linearRegression`
  - `theme.js` — theme get/set/toggle, `getChartColors`, time format functions
  - `api.js` — all 4 AI providers + `callClaudeAPI` router, `callOpenAICompatibleAPI` shared helper (with `extraHeaders`), key/model management, dynamic model lists
  - `profile.js` — profile CRUD, sex/DOB/location, `migrateProfileData`, profile dropdown
  - `data.js` — `getActiveData`, unit conversion, date range filtering, `saveImportedData`, `buildMarkerReference`
  - `pii.js` — regex + Ollama PII obfuscation, diff viewer
  - `charts.js` — Chart.js plugins (4), `createLineChart`, `destroyAllCharts`
  - `notes.js` — note editor (open/save/delete)
  - `supplements.js` — supplement editor + render section
  - `cycle.js` — menstrual cycle helpers + editor + render section
  - `context-cards.js` — 9 context card editors, shared helpers, summaries, health dots, interpretive lens
  - `pdf-import.js` — PDF pipeline, batch import, import preview, drop zone
  - `export.js` — JSON export/import, PDF report, `clearAllData`
  - `chat.js` — chat panel, `buildLabContext`, markdown rendering, personalities, per-marker AI
  - `settings.js` — settings modal, provider panels, privacy section
  - `glossary.js` — marker glossary modal
  - `feedback.js` — feedback modal (bug reports, feature requests)
  - `tour.js` — first-visit guided tour (spotlight walkthrough)
  - `changelog.js` — What's New modal, `APP_VERSION`, auto-trigger on update
  - `nav.js` — sidebar, date range filter, chart layers
  - `views.js` — `navigate`, dashboard, category, compare, correlations, detail modal, manual entry, focus card, onboarding
  - `main.js` — `DOMContentLoaded` init, event listeners, refresh callback
- **`data/`** — `seed-data.json` (baseline lab data), `demo-female.json`, `demo-male.json`
- **`tests/`** — 13 browser-based test files (`test-*.js`) + `verify-modules.js`

Functions called from inline HTML `onclick` handlers are exposed via `Object.assign(window, {...})` at the bottom of each module. Cross-module calls use `window.fn()` to avoid circular dependencies.

### Data Flow

1. `getActiveData()` is the central data pipeline: deep-clones `MARKER_SCHEMA` → collects all dates from `importedData.entries` → populates `values` arrays → calculates ratios and PhenoAge → applies unit conversion if US mode
2. All data lives in `importedData` in `localStorage` under key `labcharts-{profileId}-imported`; structure: `{ entries, notes, diagnoses, diet, exercise, sleepRest, lightCircadian, stress, loveLife, environment, interpretiveLens, healthGoals, contextNotes, menstrualCycle, customMarkers, supplements }`; unit preference under `labcharts-{profileId}-units`. Context fields store structured objects (not strings) — see Profile Context Cards section. Legacy fields (`circadian`, `sleep`, `sleepCircadian`, `fieldExperts`, `fieldLens`, old string-format context) are auto-migrated on load via `migrateProfileData()`
3. Marker values are arrays aligned with the `dates` array; `null` = no result for that date
4. `singlePoint` categories (fattyAcids) have `singlePoint: true` at category level in the schema; `getActiveData()` sets `singleDate`, `singleDateLabel` on the category and `singlePoint`, `singleDateLabel` on each marker
5. Charts use `spanGaps: true` to draw lines across dates where a marker has no data
6. Sidebar counts show only markers with actual data (not schema totals)

### AI-Powered PDF Import Pipeline

The PDF parser uses Claude API to extract markers from any lab PDF (any language/format):

1. **Text extraction** (`extractPDFText`): pdf.js extracts text items with x, y coordinates and page number
2. **Page-aware row grouping**: Items are sorted by page first, then by y-coordinate (3px tolerance). Formatted as readable text with `=== Page N ===` headers.
3. **AI analysis** (`parseLabPDFWithAI`): Sends extracted text to Claude with a system prompt containing `buildMarkerReference()` output (compact JSON of all known markers with keys, units, ref ranges). Claude maps lab results to marker keys using medical knowledge.
4. **Import confirmation**: Shows preview modal with matched/unmatched markers; user confirms before saving
5. **Insulin dual-mapping**: When `hormones.insulin` is imported, it's also set as `diabetes.insulin_d` and HOMA-IR is recalculated
6. **Custom markers**: Markers not in `MARKER_SCHEMA` are auto-handled — AI suggests `category.camelCaseKey`, name, unit, and reference ranges. Definitions are stored in `importedData.customMarkers` and merged into the data pipeline at runtime (see below).

### Custom Markers

Markers not in `MARKER_SCHEMA` are auto-imported from PDFs. Storage: `importedData.customMarkers` keyed by `category.markerKey` → `{ name, unit, refMin, refMax, categoryLabel }`. Merged into `data.categories` in `getActiveData()` (new category created with 🔖 if needed). `buildMarkerReference()` includes them for dedup. Import preview: green "Matched", blue "New", yellow "Unmatched". Won't overwrite existing definitions.

### Standalone Notes

Notes are independent of lab entries — stored in `importedData.notes` as `[{ date, text }]`. Dashboard shows notes interleaved chronologically (yellow left border). `noteAnnotationPlugin` draws yellow dots on charts at note dates with hover tooltips. Notes appear in detail modals as memo icons. `buildLabContext()` includes notes in AI context.

### Profile Context Cards

Nine profile context cards stored as structured objects in `importedData`. All editors use styled button-group selectors (`.ctx-btn-group` / `.ctx-btn-option`) instead of native `<select>` dropdowns, with multi-select tag pills (`.ctx-tags` / `.ctx-tag`) for array fields.

- Dashboard renders nine cards in a `.profile-context-cards` grid (3-col on wide, 2-col on medium, 1-col on mobile) under a "What your GP won't ask you" section title with filled count (e.g., "5/9 filled"). Rendered by `renderProfileContextCards()` using a `cardDefs` array. Always visible. Ordered: Health Goals, Medical Conditions, Diet, Exercise, Sleep & Rest, Light & Circadian, Stress, Love Life & Relationships, Environment
- Each card has a **health status dot** — AI-rated green/yellow/red/gray. Loaded async via `loadContextHealthDots()` with **per-card caching** — only stale cards re-fetched. Cache: `labcharts-{profileId}-contextHealth` → `{ dots, summaries, fingerprints }`. `getCardFingerprint(key)` hashes lab data + card data + sex + DOB
- Each card has an **AI-generated tip** — brief color-coded insight (max 12 words), cached alongside dots
- Each card shows a summary (via `summaryFn`) or dashed-border placeholder; clicking opens modal editor
- **Additional Notes textarea** below cards for free-form AI context, auto-saved via `debounceContextNotes()`
- **Data structures**:
  - `diagnoses` = `{ conditions: [{ name, severity, since? }], note }` — `syncDiagnosesNote()` preserves note on condition add/delete
  - `diet` = `{ type, restrictions[], pattern, breakfast, breakfastTime, lunch, lunchTime, dinner, dinnerTime, snacks, snacksTime, note }` — meal times stored as 24h format via `parseTimeInput()`, displayed via `formatTime()`
  - `exercise` = `{ frequency, types[], intensity, dailyMovement, note }`
  - `sleepRest` = `{ duration, quality, schedule, roomTemp, issues[], environment[], practices[], note }` — Kruse-informed: room temperature, sleep environment (blackout, EMF, grounding sheet, magnetico), practices (mouth taping, cold shower, magnesium)
  - `lightCircadian` = `{ amLight, daytime, uvExposure, evening[], screenTime, techEnv[], cold, grounding, mealTiming[], note }` — Kruse-informed: AM light, UV exposure, evening discipline, cold exposure, grounding/earthing, screen time, technology environment, meal timing. Latitude auto-detected from Settings location
  - `stress` = `{ level, sources[], management[], note }`
  - `loveLife` = `{ status, relationship, satisfaction, libido, frequency, orgasm, concerns[], note }` — relationship quality, sexual health details
  - `environment` = `{ setting, climate, water, waterConcerns[], emf[], emfMitigation[], homeLight, air[], toxins[], building, note }` — Kruse-informed: water quality (spring, DDW, RO), EMF sources + mitigation, home lighting, air quality, toxin exposure, building materials
  - All nullable — `null` means not filled
- **Option arrays**: Named constants per card (e.g., `SLEEP_DURATIONS`, `ENV_WATER`, `LOVE_CONCERNS`) — search code for full list
- **Migration**: `migrateProfileData()` converts legacy fields to structured objects (old `sleepCircadian` → split, old `fieldExperts`+`fieldLens` → `interpretiveLens`). Initializes missing fields
- `buildLabContext()` serializes all 9 areas + interpretiveLens + contextNotes to AI context. Each has a `CHAT_SYSTEM_PROMPT` bullet
- All fields included in JSON export/import and PDF report

### Health Goals

- **Storage**: `importedData.healthGoals` — array of `{ text, severity }` (major/mild/minor)
- **Dashboard card**: Shows first 3 goals or placeholder. Editor: modal with live list + add form + severity pill buttons
- **AI context**: Grouped by severity (major → mild → minor). AI prioritizes major goals first
- **Export/import**: Merges array, deduplicates by text content

### Interpretive Lens

- **Storage**: `importedData.interpretiveLens` — string combining field experts and scientific paradigms
- **Dashboard**: Full-width card with purple left border above Focus Card. Click opens modal editor
- **AI context**: AI considers listed experts' work and frames analysis through specified paradigms
- **Migration**: Old `fieldExperts` + `fieldLens` auto-merged on profile load

### Menstrual Cycle Tracking

Cycle-aware lab interpretation for female profiles (`profileSex === 'female'` only):

- **Storage**: `importedData.menstrualCycle` — `null` or `{ cycleLength, periodLength, regularity, flow, contraceptive, conditions, periods[] }`. Periods: `[{ startDate, endDate, flow, symptoms[], notes }]`. Symptoms from `PERIOD_SYMPTOMS` array (10 items)
- **Helpers**: `getCyclePhase(dateStr, mc)` → `{ cycleDay, phase, phaseName }`. Phases: menstrual, follicular, ovulatory (cycleLength-14 ±1), luteal. `getNextBestDrawDate(mc)` → next early follicular window (days 3-5). `getBloodDrawPhases(mc, dates)` → maps lab dates to phases
- **Auto-calculated stats**: `calculateCycleStats(periods)` computes `cycleLength` (mean days between starts, 2+ periods, clamped 20–45), `periodLength` (mean days per period, 1+ periods, clamped 2–10), `regularity` (stdev of intervals, 3+ periods: ≤2 regular, ≤7 irregular, >7 very_irregular). Returns `null` for insufficient data. Editor shows read-only auto-calculated values when available, manual inputs as fallback. `syncMenstrualCycleProfileFromForm()` reads auto elements (`#mc-*-auto` `data-value`) when present, falls back to manual inputs
- **Dashboard**: Between context cards and supplements. Shows cycle summary (clickable to open editor), next draw recommendation, phase badges, period log, perimenopause pattern alert (if detected), heavy flow + iron alerts
- **Phase-aware reference ranges**: `PHASE_RANGES` in schema.js defines per-phase ref ranges for estradiol (pmol/L) and progesterone (nmol/L) across menstrual/follicular/ovulatory/luteal. `getActiveData()` computes `marker.phaseRefRanges[]` and `marker.phaseLabels[]` (arrays aligned with `data.dates[]`) for female profiles with cycle periods via `_getCyclePhase()` (private copy in data.js). `getEffectiveRangeForDate(marker, dateIndex)` returns phase range if available, falls back to `getEffectiveRange()`. `getPhaseRefEnvelope(marker)` returns widest span across phases (for chart ref band). All status consumers (chart point colors, chart cards, detail modal, table, heatmap, compare, glossary, trend alerts, flagged markers, AI context) use per-date ranges. Phase ranges are unit-converted and date-range-filtered alongside other marker data
- **Cycle phase bands on charts**: `phaseBandPlugin` draws vertical background shading (menstrual=red, follicular=blue, ovulatory=purple, luteal=yellow at 8% opacity) with single-letter labels at top. Toggled via Layers dropdown (`phaseOverlayMode`). `data.phaseLabels[]` computed in `getActiveData()`, filtered by `filterDatesByRange()`, passed as 5th param to `createLineChart()`
- **Period symptoms**: Multi-select from `PERIOD_SYMPTOMS` (10 items: Cramps, Mood swings, Fatigue, etc.). Stored as `period.symptoms[]`. Displayed as `.period-symptom-tag` pills in editor and dashboard. Included in AI context
- **Perimenopause detection**: `detectPerimenopausePattern(mc, dob)` — requires age 35+ and 4+ periods. Checks 4 indicators: lengthening cycles (linear regression slope>0.5, R²>0.3), increasing variability (stdev ratio>1.5), cycles >38 days, predominantly heavy flow. Needs 2+ indicators to flag. Dashboard alert + AI context
- **Heavy flow + iron alerts**: `detectCycleIronAlerts(mc, data)` — cross-references recent heavy flow with ferritin/hemoglobin/iron. Alerts: critical (below range), warning (bottom 25%), info (no iron panel). Dashboard alerts + AI context
- **AI context**: Cycle phase considered for hormones, iron/ferritin, inflammatory markers. Flags suboptimal draw timing. Phase-specific ranges included per-value in `buildLabContext()` and `askAIAboutMarker()`. Perimenopause + iron/flow alerts included
- **Export/import**: Import overwrites profile, merges periods by startDate

### Free Water Deficit

Calculated marker: `FWD = TBW × (Na / 140 − 1)`, TBW = 70kg × factor (0.6 male, 0.5 female). Requires `electrolytes.sodium` (mmol/L). Ref range: -1.5 to 1.5 L. Positive = deficit, negative = excess.

### PhenoAge (Biological Age)

Levine et al. 2018 — calculated from 9 biomarkers (albumin, creatinine, glucose, hsCRP, lymphocytesPct, MCV, RDW-CV, ALP, WBC) + chronological age (DOB required). Computed in `getActiveData()` using SI units. `refMin: null, refMax: null` — meaningful relative to chronological age. Chart adds gray dashed chronological age line. Returns `null` if any input missing.

### Focus Card

AI-generated one-sentence insight at the top of the dashboard (after drop zone, before context cards). Only renders when data exists AND `hasAIProvider()`. Cache: `labcharts-{profileId}-focusCard` — `{ fingerprint, text }`. Fingerprint is djb2 hash of entries+sex+DOB+all 9 cards+interpretiveLens. Shimmer skeleton while loading, 15s timeout. `maxTokens: 100`, non-streaming.

### Onboarding Flow

3-step guided setup: Step 1 (Import) when `!hasData`, Step 2 (Profile Banner) when data exists but sex/DOB unset, Step 3 (Completion toast). State: `labcharts-{profileId}-onboarded` — absent=show, `"profile-set"`=complete, `"dismissed"`=skipped.

### Guided Tour (Spotlight)

7-step spotlight walkthrough for first-time users. Dims the page and highlights one element at a time with an explanatory tooltip.

- **Steps**: 1) Welcome (centered, no target), 2) `#drop-zone` — Import, 3) `#sidebar-nav` — Category Navigation, 4) `.profile-context-cards` — Lifestyle Context, 5) `.settings-btn` — Settings, 6) `.feedback-btn` — Send Feedback, 7) `.chat-toggle-btn` — Ask AI
- **Auto-trigger**: `startTour(true)` called at end of `showDashboard()`. Checks `labcharts-{profileId}-tour` in localStorage — skips if `'completed'`
- **Re-trigger**: Settings → Display → "Take a Tour" button calls `startTour(false)` (skips completion check)
- **DOM**: Three fixed elements created dynamically — `#tour-overlay` (z-index 500, click-to-dismiss), `#tour-spotlight` (z-index 501, `box-shadow: 0 0 0 9999px` dimming technique), `#tour-tooltip` (z-index 502, card with title/text/dots/nav buttons)
- **Positioning**: `positionTooltip(rect, position)` places tooltip bottom/right/left/top of spotlight with viewport bounds clamping. Falls back if tooltip would overflow
- **Navigation**: Skip/Back/Next/Done buttons. Progress dots show current step. Escape key dismisses via `endTour()`
- **Cleanup**: `endTour()` removes all three DOM elements and stores completion flag
- **Generic engine**: `runTour(steps, storageKey, auto)` — filters out steps whose target element is missing, creates DOM, starts navigation. `activeTour` object holds `{ steps, storageKey, currentStep }`
- **Cycle tour**: 8-step cycle-specific tour (`CYCLE_TOUR_STEPS`). Steps: Welcome → `.cycle-summary` → `.cycle-draw-date` → `.cycle-draw-phases` → `.cycle-period-log` → `.cycle-alert` → `.chart-layers-wrapper` → `.chat-toggle-btn`. Auto-triggered via `startCycleTour(true)` after `saveMenstrualCycle()` with 600ms delay. Re-trigger via `?` button (`.cycle-tour-btn`) in cycle section header. Storage: `labcharts-{profileId}-cycleTour`

### What's New Modal

Version-triggered changelog modal so users see what changed after each PWA update.

- **Version**: `APP_VERSION` in `changelog.js` matches SW cache number (e.g., 53)
- **Storage**: `labcharts-changelog-seen` → version string. Auto-trigger after `showDashboard()` if seen !== APP_VERSION
- **HTML**: `#changelog-modal-overlay` + `#changelog-modal` with `role="dialog"`
- **Data**: `CHANGELOG` array — `[{ version, date, title, items[] }]`, newest first. Auto-trigger shows latest 3; Settings shows all
- **Trigger**: Settings → Display → "What's New" button calls `openChangelog(true)`
- **Escape/click/focus-trap**: Wired in `main.js` alongside other modals

### Dashboard Section Order

Flat layout (no collapsible toggles): 1) Drop zone, 2) Onboarding, 3) Interpretive Lens, 3b) Focus Card, 4) Context Cards, 5) Menstrual Cycle (female), 6) Supplements, 7) Key Trends + charts, 8) Trends & Alerts, 9) Data & Notes + Export.

- **Trends & Alerts**: Trend alerts first (from `detectTrendAlerts()`), then critical flags from `getAllFlaggedMarkers()` — only markers >50% of **reference** range width past boundary. Excludes markers already in trends
- **Empty state**: Onboarding Step 1 then sections 4-6 (user-input content)

### Chart Layers Dropdown

Single "Layers" dropdown controlling note dots, supplement bars, and cycle phase bands on charts. Persisted per-profile: `noteOverlayMode` in `labcharts-{profileId}-noteOverlay`, `suppOverlayMode` in `labcharts-{profileId}-suppOverlay`, `phaseOverlayMode` in `labcharts-{profileId}-phaseOverlay`. All default off. Hidden when profile has no notes/supplements/cycle data.

### Trend Alerts on Dashboard

`detectTrendAlerts(data)` — two methods per marker:
1. **Sudden change** (2+ values): latest-to-previous jump >25% of ref range AND outside range → `sudden_high`/`sudden_low` (priority over regression)
2. **Linear regression** (3+ values): normalized slope >±0.02, R²>0.5 for 4+ points → `past_high`/`past_low`/`approaching_high`/`approaching_low` (within 15% of boundary)

Dashboard: sudden=orange, past=red, approaching=yellow. Sorted by severity. Respects date range filter. Deduplicated from critical flags.

### Marker Glossary

Searchable modal (book icon in header) listing all markers grouped by category with collapsible headers, latest values, ref/optimal ranges, descriptions. Click-through to `showDetailModal(id)`.

### Batch PDF Import

Multiple PDF files processed sequentially via `handleBatchPDFs(pdfFiles)` with per-file confirm/skip. `window._batchImportContext` tracks `{ current, total }`. Summary notification at end with imported/skipped/failed counts.

### PII Obfuscation (PDF Import Privacy)

Two-path architecture replacing personal info with fake data before sending to AI:

- **Ollama path** (preferred): `sanitizeWithOllama(pdfText)` via `/api/generate`. Dedicated PII model (`getOllamaPIIModel()`, stored in `labcharts-ollama-pii-model`) can differ from main AI model
- **Regex fallback**: `obfuscatePDFText(pdfText)` → `{ obfuscated, original, replacements }`. Label-based (name/address/DOB/etc.) + pattern-based (birth numbers, SSNs, emails, phones). Collection dates and result lines protected
- **Pipeline**: 4 steps (extract → obfuscate → AI analyze → preview). Result carries `privacyMethod` ('ollama'|'regex')
- **UX**: Ollama auto-detected silently. No Ollama → one-time warning per session (`sessionStorage` key `labcharts-pii-choice`)
- **Settings**: "PDF Import Privacy" section with status card + collapsible configure panel. `labcharts-debug` enables diff viewer

### Context Assembly Pipeline

`buildLabContext()` in chat.js is the central serializer — converts all user data into a plain-text block used by Chat, Focus Card, and Health Dots. Section order optimized for AI primacy bias:

1. **Profile header** — sex, age, unit system (SI/US), today's date, collection dates
2. **Health Goals** — major→mild→minor priorities (what the user is trying to solve)
3. **Interpretive Lens** — named experts and scientific paradigms
4. **Lab values by category** — all markers with values, per-date phase ranges for female profiles
5. **Flagged Results** — quick-scan summary of out-of-range markers
6. **User Notes** — chronological notes with dates
7. **Medical Conditions** — diagnoses with severity and since-date
8. **Supplements & Medications** — with date ranges
9. **Menstrual Cycle** — cycle profile, recent periods, blood draw phases, alerts (female only)
10. **Lifestyle cards** (Diet → Exercise → Sleep → Light → Stress → Love Life → Environment)
11. **Additional Context Notes** — freetext

Empty-card guards prevent sending empty `{}` objects: `hasCardContent(obj)` in `utils.js` is the generic gate — returns `true` if any field has content (strings non-empty, arrays non-empty, `note` trimmed). Used for 7 cards (diagnoses, diet, exercise, sleep, stress, loveLife, environment). Light & Circadian uses custom `lc || autoLat` gate (external latitude). Menstrual cycle is sex-gated. Health goals and interpretive lens use type-specific checks. Staleness signals: global `NOTE:` when most recent labs are >90 days old, plus per-category `⚠ Last tested ~N months ago` after each stale category (catches old fatty acids alongside fresh CBC); `buildFocusContext()` includes `last labs <date>` in its header. `CHAT_SYSTEM_PROMPT` uses priority tiers (Core Rules → Priority Context → Lifestyle Context → Style) and instructs the AI to note stale data and treat missing fields as "user didn't provide" rather than assuming defaults. Focus card uses lightweight `buildFocusContext()` (~200-400 tokens) instead of full context. `askAIAboutMarker()` uses effective (phase-aware) ranges and includes trend direction. Chat prompt order: system prompt → lab data → persona → search instruction.

### AI Chat Panel

- Slide-out panel with streaming responses. Responsive width across 5 breakpoints (560px–1060px)
- **Markdown**: `renderMarkdown()` block-aware parser (headings, lists, code blocks, HR, paragraphs) + `applyInlineMarkdown()` (bold, italic, code, links). Streaming-compatible
- **Personalities**: 3 presets (default, House, custom). Stored per-profile in `labcharts-{profileId}-chatPersonality`. Custom personality in `labcharts-{profileId}-chatPersonalityCustom` as JSON `{ name, icon, promptText }` (backward-compat with legacy plain strings). Removed personalities (Murphy, Robby, Kruse) fall back to default
- **Named custom personalities**: `getCustomPersonality()` returns `{ name, icon, promptText }`. `pickPersonaIcon(name)` hashes name into a 10-emoji palette. `generateCustomPersonality()` calls AI to auto-generate a persona profile from a name. `getActivePersonality()` overlays dynamic name/icon onto the static custom entry. Thread metadata stores `personalityName`/`personalityIcon` for history display
- **Context**: `buildLabContext()` serializes all user data in priority order (goals→lens→values→flags→notes→conditions→supps→cycle→lifestyle). Chat history: last 20 stored, last 10 sent to API (`labcharts-{profileId}-chat`). Prompt order: system prompt → lab data → persona → search instruction
- **Marker descriptions**: `MARKER_SCHEMA` `desc` field, `localStorage` `labcharts-marker-desc` fallback for custom markers. `fetchCustomMarkerDescription()` one-time API call

### AI Provider System

Four active backends: Anthropic (cloud), OpenRouter (model marketplace), Venice (privacy cloud), Ollama (local). Routstr (decentralized/anonymous) is disabled pending a CORS fix — all code commented out with `ROUTSTR DISABLED` markers (`github.com/Routstr/routstr-core/issues/375`). Provider stored in `labcharts-ai-provider` (`'anthropic'`/`'openrouter'`/`'venice'`/`'ollama'`).

- **Routing**: `callClaudeAPI(opts)` delegates to `callAnthropicAPI`, `callOpenRouterAPI`, `callVeniceAPI`, or `callOllamaChat` based on `getAIProvider()`. All call sites use `callClaudeAPI`
- **Shared helper**: `callOpenAICompatibleAPI(endpoint, key, model, providerName, opts, extraHeaders = {})` — reusable OpenAI-format chat completions caller (message building, Bearer auth, SSE streaming, usage tracking). OpenRouter and Venice delegate to it. `extraHeaders` merged into fetch headers (OpenRouter uses `HTTP-Referer` + `X-Title` for attribution)
- **Anthropic**: Messages API + SSE streaming. Model from `getAnthropicModel()`. Key: `labcharts-api-key`
- **OpenRouter**: OpenAI-compatible API marketplace (CORS-enabled) routing to 200+ models. Via `callOpenAICompatibleAPI` with attribution headers. Model from `getOpenRouterModel()` (default: `anthropic/claude-sonnet-4-6`). Key: `labcharts-openrouter-key`. Model IDs use `provider/model-name` format (e.g., `anthropic/claude-sonnet-4-6`). **Curated model list**: `OPENROUTER_CURATED` whitelist of latest-gen medically capable models (Claude 4.6, GPT-5.2, Gemini 3.1 Pro/3 Flash, DeepSeek v3.2, Qwen 3.5/3 Max, Grok 4) — prefix-matched against model IDs. `OPENROUTER_EXCLUDE` blocklist filters codex/audio/image/oss/safeguard/coder variants. **Dynamic pricing**: `fetchOpenRouterModels()` extracts `pricing.prompt`/`pricing.completion` (per-token strings → per-million-token floats) from API response, cached in `labcharts-openrouter-pricing`. `getOpenRouterPricing(modelId)` reads cache; `getModelPricing()` in schema.js checks dynamic cache first for OpenRouter, falls back to `_default: { input: 1.00, output: 3.00, approx: true }`. Models cached in `labcharts-openrouter-models`
- **Venice**: OpenAI-compatible API via `callOpenAICompatibleAPI`. Model from `getVeniceModel()`. Key: `labcharts-venice-key`. 300s timeout
- **Ollama**: `/api/chat` + newline-delimited JSON streaming. Model from `getOllamaMainModel()`. `maxTokens` → `options.num_predict`. 120s timeout
- **Guard**: `hasAIProvider()` gates all 7 AI features (focus card, marker desc, PDF import, chat)

### Settings Modal

4 sections: **Profile** (sex, DOB, country+ZIP with auto latitude band), **Display** (units, range, theme, 24h/12h time format, guided tour), **AI Provider** (4-button toggle + conditional panel per provider), **PDF Import Privacy** (status card + collapsible configure).

- **Location**: `getProfileLocation()`, `setProfileLocation()`, `COUNTRY_LATITUDES` (~70 countries → 5 bands), `getLatitudeFromLocation()`
- **Time**: `getTimeFormat()`/`setTimeFormat()`, `formatTime()`, `parseTimeInput()`. Stored in `labcharts-time-format`
- **Provider panels**: Each shows connection status + key input (Anthropic/OpenRouter/Venice) or server config (Ollama) + model selector

### JSON Export/Import

- Export: `{ version: 2, exportedAt, entries, notes, diagnoses, diet, exercise, sleepRest, lightCircadian, stress, loveLife, environment, interpretiveLens, healthGoals, contextNotes, menstrualCycle, customMarkers, supplements }`
- Import merges entries by date, deduplicates notes, overwrites context fields, merges healthGoals by text. Handles legacy field migration. Drop zone accepts PDF and JSON

### External Dependencies (CDN)
- **Chart.js 4.4.7**, **pdf.js 3.11.174** (both SRI-verified)
- **Google Fonts**: Inter (body), Outfit (headings/`--font-display`), JetBrains Mono (data/`--font-mono`)
- **AI APIs**: Anthropic (Claude), OpenRouter (OpenAI-compatible marketplace), Venice AI (OpenAI-compatible), Ollama (local)

### Marker Key Convention
Markers are referenced as `category.markerKey` (e.g., `biochemistry.glucose`, `hormones.testosterone`). This format is used in `UNIT_CONVERSIONS`, `CORRELATION_PRESETS`, the imported data store, and AI prompt marker references.

## Development

Since the app loads external CSS/JS files, you need a local server. The dev server mirrors production routing:
```
node dev-server.js
```
If the landing page repo (`get-based-site`) is cloned as a sibling directory (`../get-based-site`), the dev server serves it at `/` and the app at `/app` — matching the production subdomain layout (`getbased.health` / `app.getbased.health`). Without the sibling repo, `/` serves the app directly. Override with `SITE_DIR=/path/to/site node dev-server.js`. Docs at `/docs/*` always route to `dist-docs/`.

No linters or build steps. An AI provider API key (Anthropic, OpenRouter, or Venice) or local Ollama is required for PDF import and chat features.

### Tests

13 browser-based test files (`test-*.js`) run assertions against source code, DOM, CSS, and live behavior. Run all headlessly:
```
./run-tests.sh
```
This auto-starts a server if needed, runs all tests via headless Chrome (Puppeteer), and exits with code 0/1. Requires Puppeteer (`npx puppeteer` or `npm i -g puppeteer`). Alternatively, with a server already running: `NODE_PATH=/path/to/node_modules node run-tests.js`

### Documentation Site

VitePress-powered docs at `/docs` (source in `docs/`). Config: `docs/.vitepress/config.mjs`. Theme: `docs/.vitepress/theme/`. Build: `npm run docs:build`. Dev: `npm run docs:dev`.

- **User guide** (`docs/guide/`): 27 pages covering all features for end users
- **Contributor docs** (`docs/contributor/`): 8 pages — architecture, module reference, data pipeline, testing, deployment, storage schema. Diagrams use ASCII box-drawing (no mermaid plugin installed)
- **Vercel**: `buildCommand: "npm run docs:build"`, `outDir: '../dist-docs'`, routes serve `/dist-docs/` at `/docs`
- **Cross-links**: index.html header, README.md all link to `/docs`
- **SW**: Does not cache `/docs/` paths (not in APP_SHELL) — correct behavior

### PWA (Progressive Web App)

Installable via `manifest.json` + `service-worker.js`. Cache: `labcharts-v55` (bump to bust). Strategies: API/OpenRouter/Venice/Ollama → bypass SW entirely (no `event.respondWith`, avoids IPC stream buffering), Google Fonts → stale-while-revalidate, CDN → cache-first, app shell → stale-while-revalidate.

### Responsive Layout

Breakpoints: 3000/2000/1600/1400px (chat panel scaling up), 1200px (context cards 3→2 col), 1024px (sidebar collapses to horizontal pill nav, charts single-col), 768px (4-col grids→1-col, header compact), 600px (settings tabs scroll, trend spark hidden), 480px (compact padding, hide header dates, full-width toasts, alert cards wrap), 375px (tightest padding for smallest phones). Grid items use `min-width: 0; overflow: hidden` to prevent content from overflowing grid cells. Charts grid uses `minmax(min(440px, 100%), 1fr)` for safe sizing. Touch: `@media (pointer: coarse)` sets 44px minimum tap targets; `@media (hover: none)` reveals hover-only elements (delete buttons, profile actions, thread actions). Chat thread rail has a back button (`.chat-rail-back`) visible only on mobile. Fatty acids chart uses `.fa-bar-chart-container` class (400px desktop, 280px mobile) instead of inline styles.

## Key Patterns

- **Status coloring**: `getStatus()` returns `"normal"`, `"high"`, `"low"`, or `"missing"`. Returns `"normal"` when refs are `null` (e.g., PhenoAge)
- **Theme**: Dark (default) / light. `setTheme()` sets `data-theme` on `<html>`. CSS vars in `:root`, overridden in `[data-theme="light"]`. `getChartColors()` reads live CSS vars for Chart.js
- **Performance**: Rendering functions accept optional `data` param. Toggle functions compute `getActiveData()` once and pass through
- **Chart lifecycle**: `chartInstances` object + `destroyAllCharts()` prevents memory leaks
- **Chart.js plugins**: `refBandPlugin` (ref range bands), `optimalBandPlugin` (green dashed), `noteAnnotationPlugin` (yellow dots), `supplementBarPlugin` (timeline bars)
- **Correlation normalization**: Values → percentage of ref range (0%=refMin, 100%=refMax)
- **`singlePoint` categories**: `singlePoint: true` in schema → grid cards instead of trend charts (fattyAcids)
- **Streaming**: SSE via `callClaudeAPI({ onStream })`
- **Security**: `escapeHTML(str)` for all innerHTML interpolation. Markdown URLs validated to http/https/mailto. `saveImportedData()` wraps localStorage in try/catch
- **Debug**: `isDebugMode()` gates all console.warn/error. Toggled in Settings → Privacy
- **Accessibility**: `:focus-visible` outlines, `role="dialog"` + `aria-modal`, `aria-label` on icon buttons, `prefers-reduced-motion`
- **Design system**: `--accent-gradient` (blue→indigo), `--shadow-lg`/`--shadow-glow`, `.ctx-btn-group`/`.ctx-btn-option` pill buttons with `selectCtxOption()`/`getSelectedOption()`
