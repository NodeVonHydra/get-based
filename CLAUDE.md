# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lab Charts is a blood work dashboard for tracking biomarker trends over time. It visualizes lab results across 15 categories (biochemistry, hormones, lipids, hematology, etc.) with Chart.js line charts, data tables, and a correlation viewer. The app starts empty and is fully data-driven — users load their data via PDF import (Spadia lab reports) or JSON files.

## Architecture

No build system, no bundler, no package manager. Three source files:

- **`index.html`** — HTML structure only (header, sidebar, modals, script/CSS includes)
- **`styles.css`** — all CSS (dark theme, responsive layout, modals, notifications, correlation view)
- **`app.js`** — all JavaScript, organized into sections:
  - `MARKER_SCHEMA` — biomarker definitions (categories, names, units, reference ranges) with no personal data
  - `UNIT_CONVERSIONS` — EU (SI) to US unit conversion factors
  - `SPADIA_NAME_MAP` — maps Czech lab test names to internal `category.marker` keys for PDF import
  - `CORRELATION_PRESETS` — predefined marker combinations for the correlation view
  - Core utilities and initialization (`getStatus`, `getActiveData`, `applyUnitConversion`, `recalculateHOMAIR`)
  - UI rendering (sidebar, dashboard with empty state, category views, chart/table toggle, detail modals, flagged marker alerts)
  - Correlation chart feature (multi-marker overlay with % normalization)
  - PDF import pipeline (`parseSpadiaPDF`, text extraction, marker matching, import preview modal, drag-and-drop)
  - JSON export/import (`exportDataJSON`, `importDataJSON`, `clearAllData`)

### Data Flow

1. `getActiveData()` is the central data pipeline: deep-clones `MARKER_SCHEMA` → collects all dates from `importedData.entries` → populates `values` arrays → applies unit conversion if US mode
2. All data lives in `importedData.entries` in `localStorage` under key `labcharts-imported`; unit preference under `labcharts-units`
3. Marker values are arrays aligned with the `dates` array; `null` = no result for that date
4. `singlePoint` categories (fattyAcids) have `singlePoint: true` at category level in the schema; `getActiveData()` sets `singleDate`, `singleDateLabel` on the category and `singlePoint`, `singleDateLabel` on each marker
5. PDF import parses text rows, maps Czech names via `SPADIA_NAME_MAP` (exact → case-insensitive → prefix/suffix → stripped match), then previews before confirming
6. JSON export saves `importedData.entries` with `{ version, exportedAt, entries }` format; JSON import merges entries by date

### External Dependencies (CDN)
- **Chart.js 4.4.7** — all chart rendering
- **pdf.js 3.11.174** — client-side PDF parsing for Spadia import
- **Inter font** (Google Fonts)

### Marker Key Convention
Markers are referenced as `category.markerKey` (e.g., `biochemistry.glucose`, `hormones.testosterone`). This format is used in `UNIT_CONVERSIONS`, `SPADIA_NAME_MAP`, `CORRELATION_PRESETS`, and the imported data store.

## Development

Open `index.html` in a browser. Since it loads external CSS/JS files, you need a local server:
```
python3 -m http.server 8000
```

There are no tests, linters, or build steps.

## Key Patterns

- **Status coloring**: `getStatus()` returns `"normal"`, `"high"`, `"low"`, or `"missing"` — used for CSS class assignment throughout
- **Chart lifecycle**: All Chart.js instances are tracked in `chartInstances` object and destroyed via `destroyAllCharts()` before re-rendering to prevent memory leaks
- **Custom Chart.js plugin**: `refBandPlugin` draws reference range bands on charts
- **Correlation normalization**: Values are converted to percentage of reference range (`0% = refMin`, `100% = refMax`) to overlay markers with different scales
- **Fatty acids category** has `singlePoint: true` at category level in `MARKER_SCHEMA` — single-date results rendered differently (grid cards instead of trend charts)
- **Empty state**: When no data is loaded, dashboard shows welcome message with import instructions; category views show "No data available"
