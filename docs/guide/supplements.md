# Supplements & Medications

Tracking your supplements and medications alongside your lab results lets you see what you were taking at the time of each blood draw — making it much easier to attribute changes to specific interventions.

## Adding Supplements

Scroll to the **Supplements** section on the dashboard and click **Add Supplement** (or the add button). For each entry you can record:

- **Name** — the supplement or medication name
- **Dosage** — amount and frequency (e.g. 5g/day, 500mg 2x/day)
- **Type** — supplement or medication
- **Start date** — when you began
- **End date** — when you stopped (leave blank if ongoing)
- **Ingredients** — individual ingredients with amounts (see below)
- **Note** — anything worth remembering (brand, why you started, side effects, etc.)

## Ingredients

Each supplement can have a detailed ingredient list. Three ways to add them:

- **Manual** — click **+ Add** to add ingredient rows one by one
- **Scan label** — take a photo of the supplement label (or upload an image). AI extracts the product name, dosage, and active ingredients automatically. Requires a vision-capable AI model.
- **Paste URL** — paste a product page link and click **Fetch**. AI reads the page and extracts product info. Works best with pages that have ingredient tables in the HTML.

All three methods populate the same editable rows — review and adjust before saving.

::: tip
The scan label feature works best with clear, well-lit photos of the Supplement Facts panel. Fillers and excipients are automatically excluded — only active ingredients are extracted.
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
