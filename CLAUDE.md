# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lab Charts is a blood work dashboard for tracking biomarker trends over time. It visualizes lab results across 15 categories (biochemistry, hormones, lipids, hematology, etc.) with Chart.js line charts, data tables, and a correlation viewer. The app starts empty and is fully data-driven — users load their data via AI-powered PDF import (any lab report) or JSON files.

**Branch: `ai-powered`** — This branch uses the Claude API for PDF parsing and includes an AI chat panel for interpreting results. The `main` branch has the original rule-based Spadia parser.

## Architecture

No build system, no bundler, no package manager. Three source files:

- **`index.html`** — HTML structure only (header, sidebar, modals with `role="dialog"`, chat panel, script/CSS includes with SRI hashes, SEO meta tags)
- **`styles.css`** — all CSS (dark/light themes, responsive layout, modals, notifications, correlation view, chat panel, empty state)
- **`app.js`** — all JavaScript: `MARKER_SCHEMA` (biomarker definitions), `UNIT_CONVERSIONS`, `CORRELATION_PRESETS`, API key management, `callClaudeAPI()` (central AI router), Settings modal, core utilities (`getStatus`, `getActiveData`, `applyUnitConversion`), UI rendering (sidebar, dashboard, category views, detail modals), focus card, onboarding flow, correlation chart, AI PDF import pipeline, standalone notes, 9 profile context editors with shared helpers (`renderSelectField`/`selectCtxOption`/`getSelectedOption`, `renderTagsField`/`toggleCtxTag`/`getSelectedTags`, `renderNoteField`, `contextEditorActions`), Chart.js plugins, JSON export/import, chat personalities, AI chat panel with markdown rendering, per-marker AI
- **`seed-data.json`** — baseline lab data in importable JSON format (4 entries across 4 dates)

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

- **Storage**: `importedData.menstrualCycle` — `null` or `{ cycleLength, periodLength, regularity, flow, contraceptive, conditions, periods[] }`. Periods: `[{ startDate, endDate, flow, notes }]`
- **Helpers**: `getCyclePhase(dateStr, mc)` → `{ cycleDay, phase, phaseName }`. Phases: menstrual, follicular, ovulatory (cycleLength-14 ±1), luteal. `getNextBestDrawDate(mc)` → next early follicular window (days 3-5). `getBloodDrawPhases(mc, dates)` → maps lab dates to phases
- **Dashboard**: Between context cards and supplements. Shows cycle summary, next draw recommendation, phase badges, period log
- **AI context**: Cycle phase considered for hormones, iron/ferritin, inflammatory markers. Flags suboptimal draw timing
- **Export/import**: Import overwrites profile, merges periods by startDate

### Free Water Deficit

Calculated marker: `FWD = TBW × (Na / 140 − 1)`, TBW = 70kg × factor (0.6 male, 0.5 female). Requires `electrolytes.sodium` (mmol/L). Ref range: -1.5 to 1.5 L. Positive = deficit, negative = excess.

### PhenoAge (Biological Age)

Levine et al. 2018 — calculated from 9 biomarkers (albumin, creatinine, glucose, hsCRP, lymphocytesPct, MCV, RDW-CV, ALP, WBC) + chronological age (DOB required). Computed in `getActiveData()` using SI units. `refMin: null, refMax: null` — meaningful relative to chronological age. Chart adds gray dashed chronological age line. Returns `null` if any input missing.

### Focus Card

AI-generated one-sentence insight at the top of the dashboard (after drop zone, before context cards). Only renders when data exists AND `hasAIProvider()`. Cache: `labcharts-{profileId}-focusCard` — `{ fingerprint, text }`. Fingerprint is djb2 hash of entries+sex+DOB+all 9 cards+interpretiveLens. Shimmer skeleton while loading, 15s timeout. `maxTokens: 100`, non-streaming.

### Onboarding Flow

3-step guided setup: Step 1 (Import) when `!hasData`, Step 2 (Profile Banner) when data exists but sex/DOB unset, Step 3 (Completion toast). State: `labcharts-{profileId}-onboarded` — absent=show, `"profile-set"`=complete, `"dismissed"`=skipped.

### Dashboard Section Order

Flat layout (no collapsible toggles): 1) Drop zone, 2) Onboarding, 3) Interpretive Lens, 3b) Focus Card, 4) Context Cards, 5) Menstrual Cycle (female), 6) Supplements, 7) Key Trends + charts, 8) Trends & Alerts, 9) Data & Notes + Export.

- **Trends & Alerts**: Trend alerts first (from `detectTrendAlerts()`), then critical flags from `getAllFlaggedMarkers()` — only markers >50% of **reference** range width past boundary. Excludes markers already in trends
- **Empty state**: Onboarding Step 1 then sections 4-6 (user-input content)

### Chart Layers Dropdown

Single "Layers" dropdown controlling note dots and supplement bars on charts. Persisted per-profile: `noteOverlayMode` in `labcharts-{profileId}-noteOverlay`, `suppOverlayMode` in `labcharts-{profileId}-suppOverlay`. Both default off. Hidden when profile has no notes/supplements.

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

### AI Chat Panel

- Slide-out panel with streaming responses. Responsive width across 5 breakpoints (560px–1060px)
- **Markdown**: `renderMarkdown()` block-aware parser (headings, lists, code blocks, HR, paragraphs) + `applyInlineMarkdown()` (bold, italic, code, links). Streaming-compatible
- **Personalities**: 4 presets (default, House, Kruse, custom). Stored per-profile in `labcharts-{profileId}-chatPersonality`. Custom text in `labcharts-{profileId}-chatPersonalityCustom`. Removed personalities (Murphy, Robby) fall back to default
- **Context**: `buildLabContext()` serializes all 9 context areas + interpretiveLens + contextNotes + lab values + notes. Chat history: last 20 stored, last 10 sent to API (`labcharts-{profileId}-chat`)
- **Marker descriptions**: `MARKER_SCHEMA` `desc` field, `localStorage` `labcharts-marker-desc` fallback for custom markers. `fetchCustomMarkerDescription()` one-time API call

### AI Provider System

Three backends: Anthropic (cloud), Venice (privacy cloud), Ollama (local). Provider stored in `labcharts-ai-provider` (`'anthropic'`/`'venice'`/`'ollama'`).

- **Routing**: `callClaudeAPI(opts)` delegates to `callAnthropicAPI`, `callVeniceAPI`, or `callOllamaChat` based on `getAIProvider()`. All call sites use `callClaudeAPI`
- **Anthropic**: Messages API + SSE streaming. Model from `getAnthropicModel()`. Key: `labcharts-api-key`
- **Venice**: OpenAI-compatible API (`https://api.venice.ai/api/v1/chat/completions`). Model from `getVeniceModel()`. Key: `labcharts-venice-key`. 300s timeout
- **Ollama**: `/api/chat` + newline-delimited JSON streaming. Model from `getOllamaMainModel()`. `maxTokens` → `options.num_predict`. 120s timeout
- **Guard**: `hasAIProvider()` gates all 7 AI features (focus card, marker desc, PDF import, chat)

### Settings Modal

4 sections: **Profile** (sex, DOB, country+ZIP with auto latitude band), **Display** (units, range, theme, 24h/12h time format), **AI Provider** (3-button toggle + conditional panel per provider), **PDF Import Privacy** (status card + collapsible configure).

- **Location**: `getProfileLocation()`, `setProfileLocation()`, `COUNTRY_LATITUDES` (~70 countries → 5 bands), `getLatitudeFromLocation()`
- **Time**: `getTimeFormat()`/`setTimeFormat()`, `formatTime()`, `parseTimeInput()`. Stored in `labcharts-time-format`
- **Provider panels**: Each shows connection status + key input (Anthropic/Venice) or server config (Ollama) + model selector

### JSON Export/Import

- Export: `{ version: 2, exportedAt, entries, notes, diagnoses, diet, exercise, sleepRest, lightCircadian, stress, loveLife, environment, interpretiveLens, healthGoals, contextNotes, menstrualCycle, customMarkers, supplements }`
- Import merges entries by date, deduplicates notes, overwrites context fields, merges healthGoals by text. Handles legacy field migration. Drop zone accepts PDF and JSON

### External Dependencies (CDN)
- **Chart.js 4.4.7**, **pdf.js 3.11.174** (both SRI-verified)
- **Google Fonts**: Inter (body), Outfit (headings/`--font-display`), JetBrains Mono (data/`--font-mono`)
- **AI APIs**: Anthropic (Claude), Venice AI (OpenAI-compatible), Ollama (local)

### Marker Key Convention
Markers are referenced as `category.markerKey` (e.g., `biochemistry.glucose`, `hormones.testosterone`). This format is used in `UNIT_CONVERSIONS`, `CORRELATION_PRESETS`, the imported data store, and AI prompt marker references.

## Development

Open `index.html` in a browser. Since it loads external CSS/JS files, you need a local server:
```
python3 -m http.server 8000
```

There are no tests, linters, or build steps. An Anthropic API key is required for PDF import and chat features.

### PWA (Progressive Web App)

Installable via `manifest.json` + `service-worker.js`. Cache: `labcharts-v14` (bump to bust). Strategies: API → network-only, Google Fonts → stale-while-revalidate, CDN → cache-first, app shell → stale-while-revalidate. Ollama (localhost) → network-only.

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
