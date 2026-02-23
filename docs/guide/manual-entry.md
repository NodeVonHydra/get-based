# Manual Entry

If you have lab results but no PDF — for example, values written on paper, a result emailed as plain text, or numbers from a health device — you can enter them directly into Get Based using the manual entry form.

## No AI Provider Needed

Manual entry does not use AI. You don't need an API key or any provider configured to use it.

## How to Use Manual Entry

1. In the sidebar, click **Manual Entry** (or find it in the navigation menu on mobile)
2. Select the **date** of the lab draw
3. Browse or search for markers by name or category
4. Enter the value for each marker you have results for
5. Click **Save**

The results are saved immediately and appear in your charts alongside any PDF-imported data.

::: tip You don't need to fill in everything
Only enter the markers you have results for. Leave the rest blank. Get Based uses `null` for missing values and draws chart lines across gaps automatically.
:::

## Finding Markers

The marker list is organized by the same 15 categories used throughout the app (biochemistry, hormones, lipids, etc.). You can scroll through a category or use the search box to find a marker by name.

If a marker you're looking for doesn't appear in the list, it may be a custom marker from a previous PDF import. Custom markers also appear in the manual entry list once they've been created.

## Editing Existing Values

To correct a value you've already entered, import a new entry for the same date with the corrected value. Entries are merged by date, so the new value replaces the old one for that marker on that date.

::: warning Units
Make sure you enter values in the units shown next to each marker. Get Based stores data in SI units (EU mode) by default. If your results are in US units (e.g., mg/dL for glucose instead of mmol/L), switch to **US units** in **Settings → Display** before entering values, or convert manually.
:::

## Use Cases

- Results from a doctor's visit where only a printout was provided
- Home test kits (cholesterol monitors, blood glucose meters, etc.)
- Entering a single marker you noticed was missing after a PDF import
- Historical values you've tracked in a spreadsheet
