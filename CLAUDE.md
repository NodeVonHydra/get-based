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
  - JSON export/import (`exportDataJSON`, `importDataJSON`, `clearAllData`)
  - AI chat panel (`buildLabContext`, `sendChatMessage`, `openChatPanel`, chat history management)
  - Per-marker AI (`askAIAboutMarker` — opens chat with pre-filled marker-specific prompt)
- **`seed-data.json`** — baseline lab data in importable JSON format (4 entries across 4 dates)

### Data Flow

1. `getActiveData()` is the central data pipeline: deep-clones `MARKER_SCHEMA` → collects all dates from `importedData.entries` → populates `values` arrays → applies unit conversion if US mode
2. All data lives in `importedData.entries` in `localStorage` under key `labcharts-{profileId}-imported`; unit preference under `labcharts-{profileId}-units`
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

### AI Chat Panel

- Slide-out panel on the right side with streaming responses
- `buildLabContext()` serializes full profile data for the system prompt
- Chat history stored per-profile in `labcharts-{profileId}-chat` (last 20 messages, last 10 sent to API)
- `CHAT_SYSTEM_PROMPT` defines the lab analyst role with medical disclaimer
- Per-marker "Ask AI" button in detail modals pre-fills the chat input

### API Key Management

- Stored globally in `labcharts-api-key` (not per-profile — belongs to user's Anthropic account)
- Settings modal accessible from gear button in header
- `callClaudeAPI({ system, messages, maxTokens, onStream })` — central function for all AI calls
  - Uses `anthropic-dangerous-direct-browser-access: true` header for direct browser access
  - Model: `claude-sonnet-4-5-20250929`
  - Supports streaming via SSE parsing for chat responses

### JSON Export/Import

- Export format: `{ version: 1, exportedAt, entries: [{ date, markers: { "category.key": value } }] }`
- Import merges entries by date; drop zone accepts both PDF and JSON files

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

## Key Patterns

- **Status coloring**: `getStatus()` returns `"normal"`, `"high"`, `"low"`, or `"missing"` — used for CSS class assignment throughout
- **Chart lifecycle**: All Chart.js instances are tracked in `chartInstances` object and destroyed via `destroyAllCharts()` before re-rendering to prevent memory leaks
- **Custom Chart.js plugin**: `refBandPlugin` draws reference range bands on charts
- **Correlation normalization**: Values are converted to percentage of reference range (`0% = refMin`, `100% = refMax`) to overlay markers with different scales
- **Fatty acids category** has `singlePoint: true` at category level in `MARKER_SCHEMA` — single-date results rendered differently (grid cards instead of trend charts)
- **Empty state**: When no data is loaded, dashboard shows welcome message with import instructions; category views show "No data available"
- **Streaming**: Chat uses SSE streaming via `callClaudeAPI({ onStream })` for real-time response display
