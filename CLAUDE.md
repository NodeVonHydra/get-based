# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lab Charts is a blood work dashboard for tracking biomarker trends over time. It visualizes lab results across 15 categories (biochemistry, hormones, lipids, hematology, etc.) with Chart.js line charts, data tables, and a correlation viewer. The app starts empty and is fully data-driven — users load their data via PDF import (Spadia lab reports) or JSON files.

## Architecture

No build system, no bundler, no package manager. Three source files:

- **`index.html`** — HTML structure only (header, sidebar, modals, script/CSS includes)
- **`styles.css`** — all CSS (dark theme, responsive layout, modals, notifications, correlation view, empty state)
- **`app.js`** — all JavaScript (~1500 lines), organized into sections:
  - `MARKER_SCHEMA` — biomarker definitions (categories, names, units, reference ranges) with no personal data
  - `UNIT_CONVERSIONS` — EU (SI) to US unit conversion factors
  - `SPADIA_NAME_MAP` — maps Czech lab test names to internal `category.marker` keys for PDF import
  - `SPADIA_SECTION_HEADERS` — Czech section header names to skip during PDF parsing
  - `CORRELATION_PRESETS` — predefined marker combinations for the correlation view
  - Core utilities and initialization (`getStatus`, `getActiveData`, `applyUnitConversion`, `recalculateHOMAIR`)
  - UI rendering (sidebar, dashboard with empty state, category views, chart/table toggle, detail modals, flagged marker alerts)
  - Correlation chart feature (multi-marker overlay with % normalization)
  - PDF import pipeline (`parseSpadiaPDF`, `extractMarkersFromPDFText`, `parseDataRow`, import preview modal, drag-and-drop)
  - JSON export/import (`exportDataJSON`, `importDataJSON`, `clearAllData`)
- **`seed-data.json`** — baseline lab data in importable JSON format (4 entries across 4 dates)

### Data Flow

1. `getActiveData()` is the central data pipeline: deep-clones `MARKER_SCHEMA` → collects all dates from `importedData.entries` → populates `values` arrays → applies unit conversion if US mode
2. All data lives in `importedData.entries` in `localStorage` under key `labcharts-imported`; unit preference under `labcharts-units`
3. Marker values are arrays aligned with the `dates` array; `null` = no result for that date
4. `singlePoint` categories (fattyAcids) have `singlePoint: true` at category level in the schema; `getActiveData()` sets `singleDate`, `singleDateLabel` on the category and `singlePoint`, `singleDateLabel` on each marker
5. Charts use `spanGaps: true` to draw lines across dates where a marker has no data
6. Sidebar counts show only markers with actual data (not schema totals)

### PDF Import Pipeline

The PDF parser (`parseSpadiaPDF`) extracts markers from Spadia lab PDFs (Czech format):

1. **Text extraction**: pdf.js extracts text items with x, y coordinates and page number
2. **Page-aware row grouping**: Items are sorted by page first, then by y-coordinate. Only items on the **same page** within 3px y-tolerance are grouped into a row. This prevents cross-page collisions (items from different pages at similar y positions being merged).
3. **Row parsing** (`parseDataRow`): Filters noise (material codes S/B/P/U/xxx, assessment bars `|   |*|   |`, `$` symbols, section headers, page headers). Extracts test name, value, and reference range.
4. **Name matching**: Exact → case-insensitive → prefix/suffix fuzzy (min 3 chars, longest match wins) → stripped prefix/suffix retry
5. **Cross-validation**: If matched and both extracted and schema reference ranges exist, rejects matches where midpoints differ by more than 10x the schema range span
6. **Import confirmation**: Shows preview modal with matched/unmatched markers; user confirms before saving
7. **Insulin dual-mapping**: When `hormones.insulin` is imported, it's also set as `diabetes.insulin_d` and HOMA-IR is recalculated

### JSON Export/Import

- Export format: `{ version: 1, exportedAt, entries: [{ date, markers: { "category.key": value } }] }`
- Import merges entries by date; drop zone accepts both PDF and JSON files

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

## PDF Parser Pitfalls

When modifying the PDF parser, be aware of these issues that were previously encountered and fixed:

- **Cross-page row merging**: PDF pages share the same y-coordinate space. Items from page 1 at y≈734 can collide with page 2 at y≈735. Always sort/group by page first.
- **Material code "P" in names**: "P anorganický" (phosphorus) starts with "P" which is also a material code. Don't strip leading S/B/P from names — material codes are already filtered as standalone items.
- **CRP vs hs-CRP**: Regular "CRP" (value "< 1.0") and "hs CRP" (value "0.68") are separate tests. Only map specific hs-CRP variants to `proteins.hsCRP`.
- **Eosinofily/Basofily**: Plain names without "#" are percentage values in the PDF; only the "#" variants (e.g., "Eosinofily #") are absolute counts mapping to `differential.eosinophils`.
- **Assessment bars**: Text items like `|   |*|   |` from the visual assessment column must be filtered.
- **"Moč" ambiguity**: Means "urine" in Czech — don't use as alias for urea (Močovina).
