# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lab Charts is a blood work dashboard for tracking biomarker trends over time. It visualizes lab results across 15 categories (biochemistry, hormones, lipids, hematology, etc.) with Chart.js line charts, data tables, and a correlation viewer. The app starts empty and is fully data-driven — users load their data via AI-powered PDF import (any lab report) or JSON files.

**Branch: `ai-powered`** — This branch uses the Claude API for PDF parsing and includes an AI chat panel for interpreting results. The `main` branch has the original rule-based Spadia parser.

## Architecture

No build system, no bundler, no package manager. Three source files:

- **`index.html`** — HTML structure only (header, sidebar, modals, chat panel, script/CSS includes)
- **`styles.css`** — all CSS (dark/light themes, responsive layout, modals, notifications, correlation view, chat panel, empty state)
- **`app.js`** — all JavaScript, organized into sections:
  - `MARKER_SCHEMA` — biomarker definitions (categories, names, units, reference ranges, descriptions) with no personal data
  - `UNIT_CONVERSIONS` — EU (SI) to US unit conversion factors
  - `CORRELATION_PRESETS` — predefined marker combinations for the correlation view
  - API key management (`getApiKey`, `saveApiKey`, `hasApiKey`, `validateApiKey`)
  - `callClaudeAPI()` — central API helper with streaming support
  - Settings modal (`openSettingsModal`, `closeSettingsModal`, `handleSaveApiKey`, `updateSettingsUI`) — contains API key, sex, DOB, unit system, range mode, and theme controls
  - `updateHeaderRangeToggle()` — renders range mode toggle (Optimal/Reference/Both) in header, synced with settings modal
  - Core utilities and initialization (`getStatus`, `getActiveData`, `applyUnitConversion`, `recalculateHOMAIR`)
  - UI rendering (sidebar, dashboard with onboarding flow, category views, chart/table toggle, detail modals, flagged marker alerts)
  - Focus card (`hashString`, `getFocusCardFingerprint`, `renderFocusCard`, `loadFocusCard`, `refreshFocusCard` — AI-generated one-sentence insight)
  - Onboarding flow (`renderOnboardingBanner`, `completeOnboardingSex`, `completeOnboardingProfile`, `dismissOnboarding` — 3-step guided setup)
  - Correlation chart feature (multi-marker overlay with % normalization)
  - AI PDF import pipeline (`extractPDFText`, `parseLabPDFWithAI`, `buildMarkerReference`, import preview modal, drag-and-drop)
  - Standalone notes (`openNoteEditor`, `saveNote`, `deleteNote` — date-independent annotations)
  - Diagnoses, diet, exercise, sleep & circadian, health goals & interpretive lens profile context (`openDiagnosesEditor`, `openDietEditor`, `openExerciseEditor`, `openSleepCircadianEditor`, `openHealthGoalsEditor`, `openInterpretiveLensEditor`)
  - DOB management (`getProfileDob`, `setProfileDob`, `switchDob`)
  - Chart annotation plugin (`noteAnnotationPlugin` — subtle dots at note dates with hover tooltips)
  - Marker descriptions (`getMarkerDescription` — reads hardcoded `desc` from schema, falls back to localStorage for custom markers)
  - JSON export/import (`exportDataJSON`, `importDataJSON`, `clearAllData`)
  - Chat personalities (`CHAT_PERSONALITIES`, `setChatPersonality`, `getActivePersonality`, `loadChatPersonality`, `updatePersonalityBar`)
  - AI chat panel (`buildLabContext`, `sendChatMessage`, `openChatPanel`, chat history management)
  - Markdown rendering (`renderMarkdown` — block-aware parser, `applyInlineMarkdown` — inline formatting helper)
  - Per-marker AI (`askAIAboutMarker` — opens chat with pre-filled marker-specific prompt)
- **`seed-data.json`** — baseline lab data in importable JSON format (4 entries across 4 dates)

### Data Flow

1. `getActiveData()` is the central data pipeline: deep-clones `MARKER_SCHEMA` → collects all dates from `importedData.entries` → populates `values` arrays → calculates ratios and PhenoAge → applies unit conversion if US mode
2. All data lives in `importedData` in `localStorage` under key `labcharts-{profileId}-imported`; structure: `{ entries, notes, diagnoses, diet, exercise, sleepCircadian, interpretiveLens, healthGoals }`; unit preference under `labcharts-{profileId}-units`. Legacy fields (`circadian`, `sleep`, `fieldExperts`, `fieldLens`) are auto-migrated on load via `migrateProfileData()`
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

### Profile Context Cards

Six profile context cards stored as free-text strings in `importedData`: `diagnoses`, `diet`, `exercise`, `sleepCircadian`, `interpretiveLens` (plus structured `healthGoals`):

- Dashboard renders six cards in a `.profile-context-cards` grid (3-col on wide, 2-col on medium, 1-col on mobile) under a "What your GP won't ask you" section title with filled count (e.g., "3/6 filled"). Rendered by `renderProfileContextCards()`. Always visible. Ordered: Health Goals, Medical Conditions, Diet, Exercise, Sleep & Circadian, Interpretive Lens
- Each card has an info icon (i) with a hover tooltip explaining why that context matters for lab interpretation
- Each card shows current text or a placeholder prompt; clicking opens a modal editor
- **Merged fields**: Sleep & Circadian combines old `sleep` + `circadian`; Interpretive Lens combines old `fieldExperts` + `fieldLens`. Migration happens automatically via `migrateProfileData()` on profile load
- `buildLabContext()` prepends `## Medical Conditions / Diagnoses`, `## Diet`, `## Exercise & Movement`, `## Sleep & Circadian`, `## Health Goals (Things to Solve)`, and `## Interpretive Lens` sections to the AI context
- `CHAT_SYSTEM_PROMPT` instructs the AI to factor all six into lab interpretation
- All fields are included in JSON export/import; import handles both old and new field names

### Health Goals

Structured list of things the user wants to solve or improve, each with a severity level:

- **Storage**: `importedData.healthGoals` — array of `{ text, severity }` where severity is `major`, `mild`, or `minor`
- **Dashboard card** (🎯): Shows severity count summary (e.g. "2 major, 1 mild goals") or placeholder. Opens `openHealthGoalsEditor()`
- **Editor**: Modal with live list of goals (severity badge + text + delete button), add form (text input + severity dropdown + Add button), Done/Clear All buttons. Enter key in text input triggers add. Changes persist immediately on add/delete
- **AI context**: `buildLabContext()` adds `## Health Goals (Things to Solve)` section grouped by severity (major → mild → minor)
- **System prompt**: AI prioritizes analysis around stated goals, focusing on major priorities first
- **Export/import**: Included in JSON export; import merges array, deduplicating by text content
- **CSS**: `.goals-list`, `.goals-severity-badge` with `.severity-major` (red), `.severity-mild` (yellow), `.severity-minor` (green)

### Interpretive Lens

Combines field experts and scientific paradigms into a single interpretive framework for lab analysis:

- **Storage**: `importedData.interpretiveLens` — string
- **Dashboard card** (🔬): Shows text preview (truncated at 200 chars) or placeholder. Opens `openInterpretiveLensEditor()`
- **Editor**: Textarea modal (`openInterpretiveLensEditor`, `saveInterpretiveLens`, `clearInterpretiveLens`). Placeholder suggests both experts and paradigms
- **AI context**: `buildLabContext()` adds `## Interpretive Lens` section
- **System prompt**: AI considers listed experts' published work and frames analysis through specified paradigms
- **Migration**: Old `fieldExperts` + `fieldLens` fields are auto-merged on profile load

### Menstrual Cycle Tracking

Cycle-aware lab interpretation for female profiles — tracks cycle profile, period log, and maps blood draw dates to cycle phases:

- **Visibility**: Only renders when `profileSex === 'female'`
- **Storage**: `importedData.menstrualCycle` — `null` (not set up) or object with `{ cycleLength, periodLength, regularity, flow, contraceptive, conditions, periods[] }`
- **Period log**: `periods` array of `{ startDate, endDate, flow, notes }`, most recent first
- **Helpers**:
  - `getCyclePhase(dateStr, mc)` — returns `{ cycleDay, phase, phaseName }` or `null`. Phases: menstrual (1–periodLength), follicular, ovulatory (ovulationDay±1), luteal. Ovulation estimated at `cycleLength - 14`
  - `getNextBestDrawDate(mc)` — predicts next early follicular window (days 3-5) from most recent period + cycle length
  - `getBloodDrawPhases(mc, dates)` — maps each lab date to its cycle phase
- **Dashboard section**: Between profile context cards and supplements. Setup prompt when `null`; when configured shows cycle summary, next draw recommendation (accent box), blood draw phase badges, and compact period log (last 6)
- **Editor**: `openMenstrualCycleEditor()` — structured form (not textarea) with cycle profile fields + period log management
- **AI context**: `buildLabContext()` adds `## Menstrual Cycle` section with profile summary, recent periods, blood draw phase context, and next draw recommendation
- **System prompt**: AI considers cycle phase for hormones (estrogen, progesterone, LH, FSH), iron/ferritin, inflammatory markers, insulin sensitivity. Flags suboptimal draw timing
- **Export/import**: Included in JSON export; import overwrites profile fields, merges periods by startDate
- **PDF report**: Adds cycle context section with summary and blood draw phases
- **CSS**: `.cycle-section`, `.cycle-summary`, `.cycle-draw-date` (accent box), `.cycle-phase-badge` with `.phase-menstrual` (red), `.phase-follicular` (blue), `.phase-ovulatory` (green), `.phase-luteal` (purple), `.cycle-period-log`, `.cycle-editor-form`

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

### Focus Card

AI-generated one-sentence insight at the top of the dashboard (after drop zone, before context cards):

- **Visibility**: Only renders when data exists AND `hasApiKey()` is true
- **Shimmer skeleton**: Shows animated placeholder while fetching, then the sentence
- **Cache**: `labcharts-{profileId}-focusCard` — `{ fingerprint, text }`. Fingerprint is a djb2 hash of entries+sex+DOB+context. Auto-invalidates when data changes
- **Refresh button**: Manual regenerate via `refreshFocusCard()` (clears cache, re-fetches)
- **Non-blocking**: `loadFocusCard()` called async after DOM render
- **AI prompt**: System instructs one sentence, max 40 words, naming marker+direction+clinical relevance. `maxTokens: 100`, non-streaming
- **Functions**: `hashString(str)`, `getFocusCardFingerprint()`, `renderFocusCard()`, `loadFocusCard()`, `refreshFocusCard()`
- **CSS**: `.focus-card`, `.focus-card-icon`, `.focus-card-body`, `.focus-card-text`, `.focus-card-refresh`, `.focus-card-shimmer` (animated gradient)

### Onboarding Flow

3-step guided setup replacing the bland empty state:

- **Step 1 (Import)**: Shows when `!hasData`. Step indicator (1-2-3), "Choose PDF or JSON file" button, drag-and-drop hint. Context cards/cycle/supplements still render below
- **Step 2 (Profile Banner)**: Shows at top when data exists AND `labcharts-{profileId}-onboarded` not set AND (sex OR DOB unset). Inline form with sex toggle buttons + DOB date input. "Save & Continue" or "Skip for now"
- **Step 3 (Completion)**: `showNotification("Profile set up — you're all set!", "success")` toast only
- **State key**: `labcharts-{profileId}-onboarded` — absent=show, `"profile-set"`=complete, `"dismissed"`=skipped. Auto-sets to `profile-set` if sex+DOB already present
- **Functions**: `renderOnboardingBanner()`, `completeOnboardingSex(sex)`, `completeOnboardingProfile()`, `dismissOnboarding()`
- **CSS**: `.onboarding-step1`, `.onboarding-steps`, `.onboarding-step` (`.active`/`.completed`), `.onboarding-step-line`, `.onboarding-step-labels`, `.onboarding-banner`, `.onboarding-form`, `.onboarding-sex-toggle`, `.onboarding-sex-btn`, `.onboarding-dob-input`, `.onboarding-save-btn`, `.onboarding-skip-btn`

### Dashboard Section Order

All sections are always visible (flat layout, no collapsible toggles). Section titles use `.context-section-title`.

| # | Section | Renderer |
|---|---------|----------|
| 1 | Dashboard header + drop zone | inline in `showDashboard()` |
| 2 | Onboarding Step 1 (empty) / Step 2 banner (data) | conditional |
| 3 | Focus Card (data + API key) | `renderFocusCard()` + `loadFocusCard()` |
| 4 | Profile Context Cards ("What your GP won't ask you") | `renderProfileContextCards()` |
| 5 | Menstrual Cycle (female only) | `renderMenstrualCycleSection(data)` |
| 6 | Supplements & Medications | `renderSupplementsSection()` |
| 7 | Key Trends + charts | inline (8 key markers with date range filter + layers dropdown) |
| 8 | Trends & Alerts | inline — trend alerts first, then critical flags |
| 9 | Data & Notes + Export | inline (entries + notes interleaved + export/clear buttons) |

- **Trends & Alerts**: Merged section. Trend alerts from `detectTrendAlerts()` shown first (all types: approaching yellow, past red). Below that, critical flags from `getAllFlaggedMarkers()` — only markers >50% of **reference** range width past the boundary (always uses reference range, never optimal — critical is a medical concept). Excludes markers already in trends. Based on clinical critical value literature where tightest panic thresholds sit ~40-50% of range past boundary
- **Empty state**: When no data, shows onboarding Step 1 (step indicator + import button) then sections 4-6 (context/tracking — user input, not derived)
- **No Category Overview**: Removed — duplicated by sidebar category list

### Chart Layers Dropdown

A single "Layers" dropdown controlling note dots and supplement bars on charts. Appears in category view and dashboard toolbars alongside the date range filter. Hidden when the profile has no notes/supplements.

- **`renderChartLayersDropdown()`**: Renders a dropdown trigger button with checkbox rows for Notes and Supplements
- **`toggleChartLayersDropdown(e)`**: Opens/closes dropdown with click-outside listener
- **Notes**: `noteOverlayMode` variable, persisted in `labcharts-{profileId}-noteOverlay`. `getNotesForChart(chartDates)` returns `[]` when off. `setNoteOverlay(mode)`
- **Supplements**: `suppOverlayMode` variable, persisted in `labcharts-{profileId}-suppOverlay`. `getSupplementsForChart(chartDates)` returns `[]` when off. `setSuppOverlay(mode)`
- **Default**: Both off
- **CSS**: `.chart-layers-wrapper`, `.chart-layers-dropdown`, `.chart-layers-row`

### Trend Alerts on Dashboard

Detects markers drifting toward or past reference boundaries using linear regression and sudden change detection:

- **`linearRegression(points)`**: Standard least-squares returning `{ slope, intercept, r2 }` over indexed data points
- **`detectTrendAlerts(data)`**: Two detection methods per marker:
  1. **Sudden change** (2+ values): If latest-to-previous jump exceeds 25% of reference range AND latest value is outside range → `sudden_high` or `sudden_low` (takes priority, skips regression)
  2. **Linear regression** (3+ values): Computes slope over all non-null values. Normalized slope (`slope / range`) must exceed ±0.02. R² > 0.5 required only for 4+ data points. Classifies as `past_high`, `past_low`, `approaching_high`, or `approaching_low` (within 15% of boundary)
- **Dashboard rendering**: Merged into "Trends & Alerts" section. Sudden = orange with lightning bolt, past = red, approaching = yellow. Sorted: sudden first, then past, then approaching. Trend markers are deduplicated from the critical flags below
- **Click-through**: Cards open `showDetailModal(id)` for the trending marker
- **Respects date range filter**: Uses `filterDatesByRange(data)` before detection
- **CSS**: `.trend-alert-sudden` border-left + `.trend-alert-sudden .trend-alert-arrow` color, both orange (#fb923c)

### Marker Glossary

Searchable modal listing all markers grouped by category:

- **Header button**: Book icon (&#128214;) between settings and Ask AI buttons
- **`openGlossary()`**: Renders full marker inventory from `getActiveData()` with collapsible category headers, marker cards showing name, latest value (color-coded), unit, ref range, optimal range, and hardcoded description
- **`filterGlossary()`**: Real-time search by marker name, hides empty categories
- **Click-through**: Clicking a marker closes glossary and opens `showDetailModal(id)`
- **CSS**: `.glossary-modal` (max-width 800px, max-height 85vh), collapsible categories, hover-highlighted marker cards

### Batch PDF Import

Process multiple PDF files sequentially with individual confirm/skip for each:

- **File input**: `multiple` attribute on `#pdf-input`; drop zone and file picker both handle multiple files
- **`handleBatchPDFs(pdfFiles)`**: Sequential loop — extract, parse, preview each PDF. Shows summary notification at end with imported/skipped/failed counts
- **`showBatchImportProgress(step, fileName, current, total)`**: Enhanced progress display with "Processing file X of Y" counter
- **`showImportPreviewAsync(result, fileName, current, total)`**: Promise wrapper for import preview; resolves when user confirms (→ 'import') or skips (→ 'skip')
- **Batch context**: `window._batchImportContext` stores `{ current, total }`; `showImportPreview` shows "File X of Y" counter and changes Cancel to "Skip" during batch mode
- **`confirmImport()`**: Resolves batch promise with 'import' before closing modal; `closeImportModal()` resolves with 'skip'

### PII Obfuscation (PDF Import Privacy)

Personal information in lab PDFs is replaced with fake data before sending to the Anthropic API. Two-path architecture:

- **Ollama path** (preferred): Local LLM replaces PII with plausible fake data, understands any language/format. Uses dedicated PII model (`getOllamaPIIModel()`) which can differ from the main AI model — allows a small fast model (e.g. `gemma3:1b`) for PII while a larger model handles analysis. Config stored in `labcharts-ollama` as `{ url, model }`, PII model in `labcharts-ollama-pii-model`. Functions: `getOllamaConfig()`, `saveOllamaConfig()`, `checkOllama()` (GET `/api/tags`), `sanitizeWithOllama(pdfText)` (POST `/api/generate`), `unloadOllamaPIIModel()`
- **Regex fallback**: Pattern-based detection when Ollama unavailable. `obfuscatePDFText(pdfText)` returns `{ obfuscated, original, replacements }`. Two phases:
  1. **Label-based**: Detects PII-label lines (name, address, DOB, doctor, ID, insurance) → replaces value with matching fake data
  2. **Pattern-based**: Czech birth numbers, SSNs, emails, phones, long digit sequences → replaced with fake equivalents
  - Collection date lines and result lines (containing unit keywords) are protected from modification
- **Fake data generators**: `FAKE_NAMES`, `FAKE_STREETS`, `FAKE_CITIES`, `FAKE_DOCTORS` arrays + `randomPick()`, `randomDigits()`, `fakeBirthNumber()`, `fakePhone()`, `fakeEmail()`, `fakeDate()`, `fakePatientId()`
- **UX flow**: Ollama auto-detected → used silently. No Ollama → one-time warning dialog per session (`sessionStorage` key `labcharts-pii-choice`), offers "Continue with basic mode" or "Setup Ollama"
- **Import pipeline**: `IMPORT_STEPS` has 4 steps (extract → obfuscate → AI analyze → preview). `handlePDFFile`/`handleBatchPDFs` insert obfuscation between extraction and API call. Parse result carries `privacyMethod` ('ollama'|'regex'), `privacyReplacements`, and optionally `privacyOriginal`/`privacyObfuscated` (when debug mode on)
- **Import preview**: Green lock for Ollama, yellow lock with count for regex. Debug mode adds "View privacy details" button showing before/after diff
- **Settings**: Privacy section with Ollama status dot (green/red), URL input, model dropdown, test button, debug mode toggle
- **Debug mode**: `labcharts-debug` localStorage flag. Console logs `[PII] Original:` and `[PII] Obfuscated:` on every import. Diff viewer in import preview
- **Service worker**: Ollama (localhost/127.0.0.1) requests are network-only (never cached). Cache bumped to v14
- **CSS**: `.privacy-notice` (`.privacy-notice-success`, `.privacy-notice-warning`), `.ollama-settings`, `.ollama-status`, `.ollama-status-dot`, `.pii-warning-overlay`, `.pii-warning-dialog`, `.ollama-setup-guide`, `.setup-step`, `.pii-diff-modal`, `.pii-diff-viewer`

### AI Chat Panel

- Slide-out panel on the right side with streaming responses
- **Responsive width**: Scales across 5 breakpoints — 560px default, 640px at 1400px+, 740px at 1600px+, 880px at 2000px+, 1060px at 3000px+. Font sizes, padding, gaps, and input area scale proportionally. Backdrop dims less on large screens (0.15 at 1400px+, 0.08 at 2000px+)
- **Markdown rendering**: `renderMarkdown()` is a block-aware parser supporting headings (`#`/`##`/`###`), unordered/ordered lists, fenced code blocks, horizontal rules, and paragraphs. `applyInlineMarkdown()` handles bold, italic, inline code, and links. `.chat-msg` uses `white-space: normal` — HTML elements handle all spacing. Streaming-compatible (re-parses full accumulated text on each chunk)
- **Personalities**: `CHAT_PERSONALITIES` array defines 4 presets (default, House, Kruse, custom). Personality selector bar in panel header with collapsible options. Selected personality stored per-profile in `labcharts-{profileId}-chatPersonality`. Custom personality text stored in `labcharts-{profileId}-chatPersonalityCustom`. Personality prompt is appended to `CHAT_SYSTEM_PROMPT` via `getActivePersonality()`. Switching personalities preserves chat history. Profiles with removed personalities (Murphy, Robby) gracefully fall back to default
- `buildLabContext()` serializes full profile data for the system prompt, including diagnoses, diet, circadian, exercise, lab values, flagged results, and notes
- Chat history stored per-profile in `labcharts-{profileId}-chat` (last 20 messages, last 10 sent to API)
- `CHAT_SYSTEM_PROMPT` defines the lab analyst role with medical disclaimer
- Per-marker "Ask AI" button in detail modals pre-fills the chat input
- Marker descriptions: Each marker in `MARKER_SCHEMA` has a `desc` field with a one-sentence explanation. `getMarkerDescription(id)` reads from `marker.desc` in the registry, falling back to `localStorage` key `labcharts-marker-desc` for custom markers. For custom markers without a cached description, `fetchCustomMarkerDescription()` calls Claude API (one-time, then cached in localStorage). Displayed between the unit/reference line and the chart in the detail modal

### AI Provider System

Two AI backends: Anthropic (cloud) and Ollama (local). User picks in Settings → AI Provider toggle.

- **Provider storage**: `labcharts-ai-provider` — `'anthropic'` (default) or `'ollama'`
- **Functions**: `getAIProvider()`, `setAIProvider(provider)`, `hasAIProvider()` (returns `hasApiKey()` for Anthropic, `true` for Ollama)
- **Routing**: `callClaudeAPI(opts)` is the router — delegates to `callAnthropicAPI(opts)` or `callOllamaChat(opts)` based on provider. All 4 call sites (focus card, marker desc, PDF parsing, chat) use `callClaudeAPI` unchanged
- **`callAnthropicAPI`**: Anthropic Messages API with SSE streaming. Model: `claude-sonnet-4-5-20250929`. Requires `labcharts-api-key`
- **`callOllamaChat`**: Ollama `/api/chat` endpoint with newline-delimited JSON streaming. Model from `getOllamaMainModel()`. System message prepended as `{ role: 'system' }`. `maxTokens` → `options.num_predict`. 120s timeout
- **Ollama model storage**: `labcharts-ollama-model` (main AI model), `labcharts-ollama-pii-model` (PII obfuscation model, can differ). Functions: `getOllamaMainModel()`, `setOllamaMainModel()`, `getOllamaPIIModel()`, `setOllamaPIIModel()`
- **Guard points**: `hasAIProvider()` replaces `hasApiKey()` at all 7 AI feature gates (focus card render/load, marker desc fetch/display, PDF import single/batch, chat panel open)
- **Error handling**: Ollama not running → `"Ollama is not running. Start it or switch to Anthropic in Settings."`

### Settings Modal

Grouped into 4 sections: **Profile** (sex, DOB), **Display** (units, range, theme), **AI Provider** (toggle + conditional panel), **Privacy** (PII model, debug mode).

- **AI Provider toggle**: Two buttons — `☁️ Anthropic` / `🏠 Ollama`. `switchAIProvider(provider)` re-renders the panel without reloading the full modal
- **Anthropic panel**: API key input, save/validate, remove, privacy notice (existing UI)
- **Ollama panel**: Status dot, URL input + test button, model dropdown, "Don't have Ollama?" setup link
- **Privacy section**: PII obfuscation status, separate PII model dropdown (when Ollama available), debug mode toggle
- **CSS**: `.settings-group-title` (section dividers), `.ai-provider-toggle`, `.ai-provider-btn`, `.ai-provider-panel`, `.ai-provider-desc`

### API Key Management

- Stored globally in `labcharts-api-key` (not per-profile — belongs to user's Anthropic account)
- Settings modal accessible from gear button in header
- Only used when AI Provider is set to Anthropic

### JSON Export/Import

- Export format: `{ version: 1, exportedAt, entries: [...], notes: [...], diagnoses: "...", diet: "...", exercise: "...", sleepCircadian: "...", interpretiveLens: "...", healthGoals: [...] }`
- Import merges entries by date, deduplicates notes by date+text, overwrites diagnoses/diet/exercise if present, merges healthGoals by text. Handles legacy fields: old `circadian`+`sleep` → `sleepCircadian`, old `fieldExperts`+`fieldLens` → `interpretiveLens`
- Drop zone accepts both PDF and JSON files

### External Dependencies (CDN)
- **Chart.js 4.4.7** — all chart rendering
- **pdf.js 3.11.174** — client-side PDF text extraction
- **Inter font** (Google Fonts)
- **Anthropic API** — Claude Sonnet for PDF parsing and chat (when Anthropic provider selected, requires user's API key)
- **Ollama** — local LLM for all AI features and PII obfuscation (when Ollama provider selected, runs on user's machine)

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
- **Cache name**: `labcharts-v13` — bump version to bust cache on deploy
- **Icons**: `icon.svg` (vector, also serves as favicon), `icon-192.png`, `icon-512.png` (rasterized for Android/iOS)
- **`index.html`** includes `<link rel="manifest">`, `<meta name="theme-color">`, Apple mobile web app meta tags, and SW registration script
- **Offline**: After first visit, the entire app shell loads from cache; only AI features (PDF parsing, chat) require network

## Key Patterns

- **Status coloring**: `getStatus()` returns `"normal"`, `"high"`, `"low"`, or `"missing"` — used for CSS class assignment throughout. Returns `"normal"` when `refMin`/`refMax` are `null` (e.g., PhenoAge)
- **Theme system**: Dark (default) and light modes. `setTheme(theme)` sets `data-theme` attribute on `<html>`, updates toggle button icon (sun/moon), and meta theme-color. Theme stored in `labcharts-theme` localStorage key. CSS uses `[data-theme="light"]` selector to override `:root` variables. `getChartColors()` reads live CSS variable values for Chart.js configs. Canvas plugins read CSS variables directly via `getComputedStyle` for theme-aware rendering
- **Performance**: UI rendering functions (`buildSidebar`, `navigate`, `showDashboard`, `showCategory`, `showCompare`, `showCorrelations`, `updateHeaderDates`) accept optional `data` parameter. Toggle functions (`switchDob`, `switchSex`, `switchUnitSystem`, `switchRangeMode`) compute `getActiveData()` once and pass it through, avoiding redundant pipeline calls
- **Chart lifecycle**: All Chart.js instances are tracked in `chartInstances` object and destroyed via `destroyAllCharts()` before re-rendering to prevent memory leaks
- **Custom Chart.js plugins**: `refBandPlugin` draws reference range bands on charts; `optimalBandPlugin` draws green dashed optimal range bands; `noteAnnotationPlugin` draws yellow dots at note dates with hover tooltips; `supplementBarPlugin` draws supplement/medication timeline bars
- **Correlation normalization**: Values are converted to percentage of reference range (`0% = refMin`, `100% = refMax`) to overlay markers with different scales
- **Fatty acids category** has `singlePoint: true` at category level in `MARKER_SCHEMA` — single-date results rendered differently (grid cards instead of trend charts)
- **Empty state**: When no data is loaded, dashboard shows welcome message with import instructions; category views show "No data available"
- **Streaming**: Chat uses SSE streaming via `callClaudeAPI({ onStream })` for real-time response display
