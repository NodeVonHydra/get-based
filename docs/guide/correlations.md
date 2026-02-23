# Correlations

The Correlations view plots two biomarkers against each other as a scatter chart. Each point represents a single lab date, positioned by the values of both markers on that date. This reveals whether the two markers tend to rise and fall together — or move in opposite directions.

## Opening the Correlations View

Select **Correlations** in the sidebar. You will see two marker selectors — one for the horizontal (X) axis and one for the vertical (Y) axis. Choose any two markers from your data and the scatter plot updates immediately.

::: tip
You need at least three lab entries to see a meaningful scatter pattern. More dates produce a more informative plot.
:::

## How Values Are Normalized

Values on both axes are shown as a **percentage of the reference range**, where 0% is the lower reference limit and 100% is the upper limit. Normalizing this way means you can compare markers with very different units or scales on the same chart — a glucose value in mmol/L and a ferritin value in µg/L land on the same 0–100% grid.

Values outside the reference range appear below 0% or above 100%, making it easy to see when both markers were simultaneously out of range.

## Preset Correlation Pairs

Get Based includes a set of curated preset pairs for commonly studied relationships — for example, LDL and triglycerides, or glucose and insulin. Select a preset from the dropdown to jump directly to that pair without manually choosing both markers.

## Interpreting Results

A cluster of points running from lower-left to upper-right suggests the two markers tend to rise together (positive correlation). A cluster running from upper-left to lower-right suggests they move in opposite directions (negative correlation). A scattered cloud with no clear direction suggests the markers are not strongly related in your data.

::: warning
Correlation in your personal data does not prove causation, and a small number of data points can produce misleading patterns. Use correlations as a starting point for conversations with your healthcare provider, not as a definitive finding.
:::

## Date Range Filter

The active date range filter applies to the correlations view. Only lab dates within the selected range appear as points on the scatter plot. Narrowing the range lets you examine whether a relationship between two markers changed during a specific period.
