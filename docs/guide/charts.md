# Charts

Get Based visualizes every biomarker as a line chart over time. Charts are grouped by category — Biochemistry, Hormones, Lipids, Hematology, and so on — and each category gets its own section on the dashboard.

## Reading a Chart

Each line chart shows one marker's values plotted across your lab dates. The horizontal axis is time; the vertical axis is the marker's value in your chosen unit (SI or US conventional).

**Reference range band** — A gray shaded region marks the standard reference range. Values inside the band are normal; values outside are colored accordingly.

**Optimal range band** — A green dashed outline shows a tighter optimal range when one is defined. Optimal ranges represent values associated with better long-term outcomes, not just "not abnormal."

**Data points** — Each dot represents a single lab result. Point color reflects status: green for normal, red for high, blue for low.

**Span gaps** — If a marker has no result on a particular date, the line continues across that gap. You will not see a break in the line just because one date is missing a value.

## Chart Layers

The **Layers** dropdown (visible in the chart area header) lets you overlay additional context on top of every chart:

- **Note dots** — Yellow dots appear on the chart at dates where you have written a standalone note. Hover over a dot to see the note text.
- **Supplement bars** — Colored bars along the bottom of the chart show when supplements or medications were active.
- **Cycle phase bands** — Vertical shading shows your menstrual cycle phases: red (menstrual), blue (follicular), purple (ovulatory), yellow (luteal). A single letter at the top of each band identifies the phase. Available for female profiles with cycle data entered.

Each layer is toggled independently and your choice is saved per profile. The Layers dropdown is hidden if you have no notes, supplements, or cycle data.

## Detail Modal

Click any chart card to open the detail modal for that marker. The modal shows:

- Full history table with values, reference ranges, and status for each date
- The trend direction and any alerts
- AI interpretation (if an AI provider is configured)
- Your notes associated with that marker's dates

## Single-Point Categories

Some categories — Fatty Acids is the main example — contain measurements that are typically taken once rather than tracked over time. These display as a grid of value cards rather than a trend line chart. Each card shows the measured value alongside its reference range.

::: tip
Use the date range filter in the header to zoom into a specific period. All charts update immediately when you change the range.
:::

## PhenoAge Chart

The PhenoAge marker (under the Aging or Biochemistry category) includes a gray dashed line showing your chronological age for comparison. PhenoAge is a biological age estimate calculated from nine standard biomarkers — it requires your date of birth to be set in Settings.
