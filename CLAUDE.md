# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lab Charts is a blood work dashboard for tracking biomarker trends over time. It visualizes lab results across 15 categories (biochemistry, hormones, lipids, hematology, etc.) with Chart.js line charts, data tables, and a correlation viewer. The app starts empty and is fully data-driven — users load their data via AI-powered PDF import (any lab report) or JSON files.

**Branch: `ai-powered`** — This branch uses the Claude API for PDF parsing and includes an AI chat panel for interpreting results. The `main` branch has the original rule-based Spadia parser.

## Architecture

No build system, no bundler, no package manager. Three source files:

- **`index.html`** — HTML structure only (header, sidebar, modals, chat panel, script/CSS includes)
- **`styles.css`** — all CSS (dark theme, responsive layout, modals, notifications, correlation view, chat panel, empty state)
- **`app.js`** — all JavaScript, organized into sections:
  - `MARKER_SCHEMA` — biomarker definitions (categories, names, units, reference ranges) with no personal data
  - `UNIT_CONVERSIONS` — EU (SI) to US unit conversion factors
  - `CORRELATION_PRESETS` — predefined marker combinations for the correlation view
  - API key management (`getApiKey`, `saveApiKey`, `hasApiKey`, `validateApiKey`)
  - `callClaudeAPI()` — central API helper with streaming support
  - Settings modal (`openSettingsModal`, `closeSettingsModal`, `handleSaveApiKey`)
  - Core utilities and initialization (`getStatus`, `getActiveData`, `applyUnitConversion`, `recalculateHOMAIR`)
  - UI rendering (sidebar, dashboard with empty state, category views, chart/table toggle, detail modals, flagged marker alerts)
  - Correlation chart feature (multi-marker overlay with % normalization)
  - AI PDF import pipeline (`extractPDFText`, `parseLabPDFWithAI`, `buildMarkerReference`, import preview modal, drag-and-drop)
  - Standalone notes (`openNoteEditor`, `saveNote`, `deleteNote` — date-independent annotations)
  - Diagnoses, diet, circadian, sleep, exercise & field experts profile context (`openDiagnosesEditor`, `openDietEditor`, `openCircadianEditor`, `openSleepEditor`, `openExerciseEditor`, `openFieldExpertsEditor`)
  - DOB management (`getProfileDob`, `setProfileDob`, `switchDob`)
  - Chart annotation plugin (`noteAnnotationPlugin` — subtle dots at note dates with hover tooltips)
  - AI marker descriptions (`fetchMarkerDescription` — cached one-sentence explanations in detail modal)
  - JSON export/import (`exportDataJSON`, `importDataJSON`, `clearAllData`)
  - AI chat panel (`buildLabContext`, `sendChatMessage`, `openChatPanel`, chat history management)
  - Per-marker AI (`askAIAboutMarker` — opens chat with pre-filled marker-specific prompt)
- **`seed-data.json`** — baseline lab data in importable JSON format (4 entries across 4 dates)

### Data Flow

1. `getActiveData()` is the central data pipeline: deep-clones `MARKER_SCHEMA` → collects all dates from `importedData.entries` → populates `values` arrays → calculates ratios and PhenoAge → applies unit conversion if US mode
2. All data lives in `importedData` in `localStorage` under key `labcharts-{profileId}-imported`; structure: `{ entries, notes, diagnoses, diet, circadian, exercise, sleep, fieldExperts }`; unit preference under `labcharts-{profileId}-units`
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

When a PDF contains markers not in the hardcoded `MARKER_SCHEMA`, the AI extracts their metadata and imports them automatically:

- **Storage**: `importedData.customMarkers` — object keyed by `category.markerKey`, each value: `{ name, unit, refMin, refMax, categoryLabel }`
- **Merge in `getActiveData()`**: Before sex-specific ref adjustments, custom marker definitions are injected into `data.categories`. If the category exists in schema, the marker is added to it; if not, a new category is created with a 🔖 icon
- **AI reference**: `buildMarkerReference()` includes custom markers so subsequent PDF imports match to them instead of creating duplicates
- **Import preview**: Three groups — green "✓ Matched" (known), blue "✚ New" (custom with suggested key), yellow "? Unmatched" (truly unknown)
- **No overwrite**: Once a custom marker definition is saved, it won't be overwritten by later imports
- **JSON export/import**: `customMarkers` is included in export and merged on import (existing definitions preserved)
- **Clear**: `clearAllData()` resets `customMarkers` to `{}`
- **Rendering**: No special rendering code needed — all UI iterates `data.categories` dynamically

### Standalone Notes

Notes are independent of lab entries — they support any date and are stored in `importedData.notes` as `[{ date, text }]`:

- Dashboard shows notes interleaved chronologically with lab entries, distinguished by a yellow left border
- `openNoteEditor(date?, existingIdx?)` opens a modal with date picker + textarea; defaults to today for new notes
- `noteAnnotationPlugin` (Chart.js plugin) draws small filled yellow dots at the top edge of charts at note dates; on hover, shows a tooltip with note date and truncated text. Uses `afterDatasetsDraw` for rendering and `afterEvent` for hover detection. Interpolates position for notes falling between data points
- Notes appear in the detail modal as a clickable memo icon on date cards; clicking toggles an inline expanded note text panel (`.mv-note-text`) below the date
- `buildLabContext()` appends a `## User Notes` section so the AI chat considers notes

### Diagnoses, Diet, Circadian, Sleep, Exercise & Field Experts

Free-text profile context stored in `importedData.diagnoses`, `importedData.diet`, `importedData.circadian`, `importedData.sleep`, `importedData.exercise`, and `importedData.fieldExperts` (all strings):

- Dashboard renders six cards in a `.profile-context-cards` grid (3×2 on wide, 2-col on medium, 1-col on mobile) under a "What your GP won't ask you" section heading
- Each card has an info icon (i) with a hover tooltip explaining why that context matters for lab interpretation
- Each card shows current text or a placeholder prompt; clicking opens a modal editor
- `buildLabContext()` prepends `## Medical Conditions / Diagnoses`, `## Diet`, `## Circadian Habits`, `## Sleep`, `## Exercise & Movement`, and `## Field Experts` sections to the AI context
- `CHAT_SYSTEM_PROMPT` instructs the AI to factor all six into lab interpretation
- All fields are included in JSON export/import

### Free Water Deficit

Free Water Deficit is a calculated marker in `calculatedRatios` that estimates hydration status from serum sodium:

- **Required biomarker**: Sodium (`electrolytes.sodium`) in mmol/L
- **Formula**: `FWD = TBW × (Na / 140 − 1)`, where TBW = 70kg × TBW factor (0.6 for males, 0.5 for females)
- **Sex-aware**: Uses `profileSex` to select TBW factor; defaults to 0.6 (male) when sex is not set
- **Assumes 70kg body weight** — output is in liters (L)
- **Interpretation**: Positive = water deficit (hypernatremia), negative = water excess (hyponatremia), ~0 = euhydrated
- **Reference range**: -1.5 to 1.5 L (corresponds approximately to normal sodium 136–145 mmol/L)
- **Null handling**: Returns `null` if sodium is missing or ≤ 0

### PhenoAge (Biological Age)

PhenoAge (Levine et al. 2018) is a calculated marker in `calculatedRatios` that estimates biological age from 9 blood biomarkers + chronological age:

- **Required biomarkers**: Albumin (`proteins.albumin`), Creatinine (`biochemistry.creatinine`), Glucose (`biochemistry.glucose`), hs-CRP (`proteins.hsCRP`), Lymphocytes % (`differential.lymphocytesPct`), MCV (`hematology.mcv`), RDW-CV (`hematology.rdwcv`), ALP (`biochemistry.alp`), WBC (`hematology.wbc`)
- **Date of Birth**: Required for chronological age; stored per-profile via `getProfileDob`/`setProfileDob`, set via header date input
- **Calculation**: Performed in `getActiveData()` after ratio calculations. All 9 biomarkers are used in their native SI units (g/L, µmol/L, mmol/L, etc.) — the Levine coefficients were fitted to SI-unit data. Formula: `xb → mortality_score → PhenoAge`
- **Null handling**: Returns `null` if any of the 9 biomarkers is missing for a date, DOB is not set, CRP ≤ 0, or age ≤ 0
- **No reference range**: `refMin: null, refMax: null` — PhenoAge is meaningful relative to chronological age, not absolute bounds. `getStatus()` returns `"normal"` for null refs; `refBandPlugin` skips drawing; chart/table/modal UI omit ref range text
- **Chronological age line**: `createLineChart()` detects PhenoAge and adds a second dataset — gray dashed line showing chronological age at each date, with a legend distinguishing both lines
- **Unit system**: PhenoAge outputs years regardless of EU/US setting — no `UNIT_CONVERSIONS` entry needed

### AI Chat Panel

- Slide-out panel on the right side with streaming responses
- `buildLabContext()` serializes full profile data for the system prompt, including diagnoses, diet, circadian, exercise, lab values, flagged results, and notes
- Chat history stored per-profile in `labcharts-{profileId}-chat` (last 20 messages, last 10 sent to API)
- `CHAT_SYSTEM_PROMPT` defines the lab analyst role with medical disclaimer
- Per-marker "Ask AI" button in detail modals pre-fills the chat input
- AI marker descriptions: `fetchMarkerDescription()` calls Claude for a one-sentence explanation of each biomarker, cached globally in `localStorage` key `labcharts-marker-desc` (object keyed by marker ID). Displayed between the unit/reference line and the chart in the detail modal with a shimmer loading skeleton while fetching

### API Key Management

- Stored globally in `labcharts-api-key` (not per-profile — belongs to user's Anthropic account)
- Settings modal accessible from gear button in header
- `callClaudeAPI({ system, messages, maxTokens, onStream })` — central function for all AI calls
  - Uses `anthropic-dangerous-direct-browser-access: true` header for direct browser access
  - Model: `claude-sonnet-4-5-20250929`
  - Supports streaming via SSE parsing for chat responses

### JSON Export/Import

- Export format: `{ version: 1, exportedAt, entries: [...], notes: [...], diagnoses: "...", diet: "...", circadian: "...", exercise: "...", sleep: "...", fieldExperts: "..." }`
- Import merges entries by date, deduplicates notes by date+text, overwrites diagnoses/diet/circadian/exercise if present
- Drop zone accepts both PDF and JSON files

### External Dependencies (CDN)
- **Chart.js 4.4.7** — all chart rendering
- **pdf.js 3.11.174** — client-side PDF text extraction
- **Inter font** (Google Fonts)
- **Anthropic API** — Claude Sonnet for PDF parsing and chat (requires user's API key)

### Marker Key Convention
Markers are referenced as `category.markerKey` (e.g., `biochemistry.glucose`, `hormones.testosterone`). This format is used in `UNIT_CONVERSIONS`, `CORRELATION_PRESETS`, the imported data store, and AI prompt marker references.

## Development

Open `index.html` in a browser. Since it loads external CSS/JS files, you need a local server:
```
python3 -m http.server 8000
```

There are no tests, linters, or build steps. An Anthropic API key is required for PDF import and chat features.

### PWA (Progressive Web App)

The app is installable and works offline via a service worker:

- **`manifest.json`** — PWA manifest with app name, theme colors (`#1a1d27`/`#0f1117`), and icons
- **`service-worker.js`** — caching with route-based strategies:
  - **Anthropic API** (`api.anthropic.com`) → network-only (never cached)
  - **Google Fonts** → stale-while-revalidate
  - **CDN libraries** (`cdn.jsdelivr.net`) → cache-first (versioned URLs are immutable)
  - **App shell** (local files) → stale-while-revalidate (serve cached, update in background)
- **Cache name**: `labcharts-v2` — bump version to bust cache on deploy
- **Icons**: `icon.svg` (vector, also serves as favicon), `icon-192.png`, `icon-512.png` (rasterized for Android/iOS)
- **`index.html`** includes `<link rel="manifest">`, `<meta name="theme-color">`, Apple mobile web app meta tags, and SW registration script
- **Offline**: After first visit, the entire app shell loads from cache; only AI features (PDF parsing, chat) require network

## Key Patterns

- **Status coloring**: `getStatus()` returns `"normal"`, `"high"`, `"low"`, or `"missing"` — used for CSS class assignment throughout. Returns `"normal"` when `refMin`/`refMax` are `null` (e.g., PhenoAge)
- **Chart lifecycle**: All Chart.js instances are tracked in `chartInstances` object and destroyed via `destroyAllCharts()` before re-rendering to prevent memory leaks
- **Custom Chart.js plugins**: `refBandPlugin` draws reference range bands on charts; `noteAnnotationPlugin` draws yellow dots at note dates with hover tooltips
- **Correlation normalization**: Values are converted to percentage of reference range (`0% = refMin`, `100% = refMax`) to overlay markers with different scales
- **Fatty acids category** has `singlePoint: true` at category level in `MARKER_SCHEMA` — single-date results rendered differently (grid cards instead of trend charts)
- **Empty state**: When no data is loaded, dashboard shows welcome message with import instructions; category views show "No data available"
- **Streaming**: Chat uses SSE streaming via `callClaudeAPI({ onStream })` for real-time response display
