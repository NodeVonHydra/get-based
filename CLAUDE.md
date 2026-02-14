# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lab Charts is a blood work dashboard for tracking biomarker trends over time. It visualizes lab results across 15 categories (biochemistry, hormones, lipids, hematology, etc.) with Chart.js line charts, data tables, and a correlation viewer. It also supports importing new results from Spadia lab PDF reports (Czech lab format).

## Architecture

No build system, no bundler, no package manager. Three source files:

- **`index.html`** — HTML structure only (header, sidebar, modals, script/CSS includes)
- **`styles.css`** — all CSS (dark theme, responsive layout, modals, notifications, correlation view)
- **`app.js`** — all JavaScript (~1350 lines), organized into sections:
  - `LAB_DATA` — hardcoded baseline lab results with dates, categories, markers, reference ranges, and values
  - `UNIT_CONVERSIONS` — EU (SI) to US unit conversion factors
  - `SPADIA_NAME_MAP` — maps Czech lab test names to internal `category.marker` keys for PDF import
  - `CORRELATION_PRESETS` — predefined marker combinations for the correlation view
  - Core utilities and initialization (`getStatus`, `getActiveData`, `mergeImportedIntoData`, `applyUnitConversion`, `recalculateHOMAIR`)
  - UI rendering (sidebar, dashboard, category views, chart/table toggle, detail modals, flagged marker alerts)
  - Correlation chart feature (multi-marker overlay with % normalization)
  - PDF import pipeline (`parseSpadiaPDF`, text extraction, marker matching, import preview modal, drag-and-drop)

### Data Flow

1. `getActiveData()` is the central data pipeline: deep-clones `LAB_DATA` → merges any imported entries from `localStorage` → applies unit conversion if US mode
2. Imported data is persisted in `localStorage` under key `labcharts-imported`; unit preference under `labcharts-units`
3. Marker values are arrays aligned with the `dates` array; `null` = no result for that date
4. PDF import parses text rows, maps Czech names via `SPADIA_NAME_MAP` (exact → case-insensitive → prefix/suffix → stripped match), then previews before confirming

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
- **Fatty acids category** has `singlePoint: true` markers — single-date results rendered differently (grid cards instead of trend charts)
