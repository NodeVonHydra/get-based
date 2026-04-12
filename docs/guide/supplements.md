# Supplements & Medications

Tracking your supplements and medications alongside your lab results lets you see what you were taking at the time of each blood draw — making it much easier to attribute changes to specific interventions.

## Adding Supplements

Scroll to the **Supplements** section on the dashboard and click **Add Supplement** (or the add button). For each entry you can record:

- **Name** — the supplement or medication name
- **Dosage** — free-text note (e.g. "with food", "before bed"). Display only.
- **Doses/day** — how many servings you take per day. Acts as the default multiplier for every ingredient below.
- **Type** — supplement or medication
- **Start date** — when you began
- **End date** — when you stopped (leave blank if ongoing)
- **Ingredients** — individual ingredients with per-dose amounts (see below)
- **Note** — anything worth remembering (brand, why you started, side effects, etc.)

## Ingredients & Daily Totals

Each ingredient row has three fields: **Name**, **Per dose** (amount in one serving), and optional **×/day** (override).

**How the math works**: `daily total = per_dose × (row ×/day  or  outer Doses/day)`

Typical patterns:

**Combo product** — one pill contains everything, you take N servings a day:
- Set **Doses/day = 2** (or whatever)
- Leave every row's **×/day** blank
- Each ingredient's daily total cascades from the outer Doses/day

**Stack** — separate products on different schedules under one tracked entry (e.g. Magnesium Bisglycinate in the morning + Magnesium Taurate twice a day):
- Leave **Doses/day** blank
- Set each row's **×/day** explicitly (1 for bisglycinate, 2 for taurate)

**Hybrid** — most ingredients share a schedule, one differs:
- Set **Doses/day** to the majority value
- Override only the row that differs

The daily total shows live next to each ingredient as you type. AI chat and impact analysis receive the pre-computed totals — no ambiguity from free-text dosing.

### Three ways to add ingredients

- **Manual** — click **+ Add** to add rows one by one
- **Scan label** — photo of the Supplement Facts panel. AI extracts the product name, ingredients, and serving size. Requires a vision-capable model.
- **Paste URL** — product page link → AI reads the page and fills the form.

All three populate the same editable rows — review before saving. Labels and URLs populate the outer Doses/day where possible; per-row overrides are only needed for stacks.

::: tip
For stacks with different timing per ingredient (morning/midday/evening), leave the outer Doses/day blank and set each row's ×/day individually. The Dosage free-text field is a good place to note the timing ("1× AM, 2× PM").
:::

## Impact Analysis

When editing a supplement, an **Impact Analysis** section appears with a colored health dot and AI-generated summary. This compares your biomarker values from before and after you started the supplement.

- **Green** — beneficial or expected changes
- **Yellow** — mixed signals
- **Red** — concerning changes
- **Gray** — insufficient data

The analysis requires at least one lab result from before the supplement start date and one after. If data is insufficient, a hint explains what's needed.

Results are cached — the AI is only called once per data fingerprint. Click **refresh** to re-analyze after importing new labs.

## Timeline Bars on Charts

Once you have supplements recorded, open the **Layers** dropdown in the chart area and enable **Supplements** to overlay timeline bars at the bottom of each chart. Each bar spans the date range when you were taking that supplement.

This makes it easy to answer questions like:

- Did my ferritin improve after I started iron supplementation?
- Did my LDL change when I added fish oil?
- Was I on that medication during the period when my liver enzymes were elevated?

::: tip
The supplement overlay is especially useful when you have multiple lab dates. Enable it alongside the chart's reference range band to see at a glance whether a supplement coincided with an improvement or a new issue.
:::

## Editing and Deleting

Click any supplement in the list to edit it. Use the delete button to remove it. Changes take effect immediately.

## In AI Chat

Your supplement list (including ingredients) is included in the context sent to the AI when you chat. The AI can reference what you were taking during each blood draw and factor that into its analysis.

## Import Provenance

Every imported value tracks which PDF file it came from and when it was imported. Hover over a value card in the detail modal to see the source filename. Manual entries show "manual entry" in italics.

## Export and Import

Supplements (including ingredients) are included in your JSON export file and restored on import.
