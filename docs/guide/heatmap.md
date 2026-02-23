# Heatmap

The Heatmap view gives you a bird's-eye view of your entire lab history in one grid. Instead of reading individual charts, you can scan all your markers across all your dates at a glance.

## What the Heatmap Shows

Each row in the grid represents one biomarker. Each column represents a lab date. The cell at the intersection is colored by the status of that marker on that date:

- **Green** — value is within the normal reference range
- **Red** — value is above the upper reference limit (high)
- **Blue** — value is below the lower reference limit (low)
- **Gray / empty** — no result for that marker on that date

## Spotting Patterns

The heatmap is particularly good for:

- **Persistent problems** — A row that stays red or blue across many dates indicates a marker that has been consistently out of range.
- **Improvements** — A row that shifts from red to green shows a marker that moved back into range over time.
- **Missing data** — Gray cells reveal dates where a particular test was not run, helping you decide what to include in your next lab order.
- **Category clusters** — Because markers are grouped by category, you can often see whether a whole metabolic area (e.g., lipids or thyroid) has been in or out of balance.

::: tip
Use the date range filter in the header to narrow the heatmap to a specific period. This is helpful when you have many dates and want to focus on a particular intervention window.
:::

## Navigating from the Heatmap

Click any cell in the heatmap to open the detail modal for that marker, where you can see the exact value, reference range, notes, and an AI interpretation.
