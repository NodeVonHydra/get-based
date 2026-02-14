# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lab Charts is a single-file blood work dashboard for tracking biomarker trends over time. It visualizes lab results across 15 categories (biochemistry, hormones, lipids, hematology, etc.) with Chart.js line charts, data tables, and a correlation viewer. It also supports importing new results from Spadia lab PDF reports (Czech lab format).

## Architecture

The entire application lives in **`index.html`** (~1800 lines) — a self-contained HTML file with inline CSS and JavaScript. No build system, no bundler, no package manager.

### Key sections within `index.html`:
- **Lines 10–440**: CSS styles (dark theme, responsive layout, modals, notifications)
- **Lines 449–629**: `LAB_DATA` constant — hardcoded baseline lab results with dates, categories, markers, reference ranges, and values
- **Lines 634–675**: `UNIT_CONVERSIONS` — EU (SI) to US unit conversion factors
- **Lines 676–803**: `SPADIA_NAME_MAP` — maps Czech lab test names to internal `category.marker` keys for PDF import
- **Lines 808–817**: `CORRELATION_PRESETS` — predefined marker combinations for the correlation view
- **Lines 820–930**: Core utilities and initialization (`getStatus`, `getActiveData`, `mergeImportedIntoData`, `applyUnitConversion`, `recalculateHOMAIR`, DOMContentLoaded handler)
- **Lines 932–1350**: UI rendering (sidebar, dashboard, category views, chart/table toggle, detail modals, flagged marker alerts)
- **Lines 1376–1532**: Correlation chart feature (multi-marker overlay with % normalization)
- **Lines 1537–1800**: PDF import pipeline (`parseSpadiaPDF`, text extraction, marker matching, import preview modal, drag-and-drop)

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

Open `index.html` directly in a browser — no server needed. To serve locally:
```
python3 -m http.server 8000
```

There are no tests, linters, or build steps. The `index.html.modified` file appears to be a work-in-progress variant.

## Key Patterns

- **Status coloring**: `getStatus()` returns `"normal"`, `"high"`, `"low"`, or `"missing"` — used for CSS class assignment throughout
- **Chart lifecycle**: All Chart.js instances are tracked in `chartInstances` object and destroyed via `destroyAllCharts()` before re-rendering to prevent memory leaks
- **Custom Chart.js plugin**: `refBandPlugin` draws reference range bands on charts
- **Correlation normalization**: Values are converted to percentage of reference range (`0% = refMin`, `100% = refMax`) to overlay markers with different scales
- **Fatty acids category** has `singlePoint: true` markers — single-date results rendered differently (grid cards instead of trend charts)
