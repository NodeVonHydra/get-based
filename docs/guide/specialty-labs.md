# Specialty Labs

Beyond standard blood work, getbased supports specialty lab tests including Organic Acids Tests (OAT), amino acid panels, fatty acid profiles, toxic element screens, DUTCH hormone panels, Hair Tissue Mineral Analysis (HTMA), and GI panels. Import works the same way — drop the PDF and the AI handles the rest.

## Supported Test Types

| Test Type | Examples |
|---|---|
| OAT | Mosaic, Genova, Great Plains organic acids |
| Amino Acids | Plasma or urine amino acid profiles |
| Fatty Acids | Omega-3 index, fatty acid panels |
| Toxic Elements | Heavy metals, toxic element screens |
| DUTCH | Dried urine hormone panels |
| HTMA | Hair Tissue Mineral Analysis |
| GI | Stool analysis, gut health panels |

Any lab report that isn't standard blood work is auto-detected and routed through the specialty pipeline.

## How It Works

1. **Drop your PDF** on the dashboard — same as any other import
2. **AI detects the test type** — the AI reads the report and identifies whether it's blood work, OAT, DUTCH, or another type
3. **Markers are mapped** with test-type-prefixed categories (e.g., `oatNutritional`, `dutchHormones`) to keep specialty results separate from standard blood markers
4. **Reference ranges come from your PDF** — the AI extracts the lab's stated ranges rather than using built-in defaults
5. **Review and confirm** in the import preview, then your results appear in charts

::: tip Your lab's reference ranges
Unlike standard blood markers that use built-in reference ranges, specialty markers use the ranges printed on your specific lab report. This means your charts reflect the ranges your lab considers normal.
:::

## Custom Marker Pipeline

Specialty markers flow through the [custom marker](./custom-markers.md) pipeline. For each marker the AI extracts:

- A **key** with a test-type-prefixed category (e.g., `oatMicrobial.someMarker`)
- A **name** in plain English
- The **unit** of measurement
- **Reference ranges** from the lab report
- A **group** tag (e.g., "OAT", "DUTCH") for sidebar organization

These are created automatically during import — no manual setup required.

## Sidebar Grouping

Specialty categories appear under collapsible group headers in the sidebar. For example, an OAT import creates categories like "Microbial Overgrowth", "Nutritional Markers", and "Oxalate Markers" — all grouped under an **OAT** header you can expand or collapse.

Click the group header to toggle visibility. Collapse state is remembered across sessions.

## Importing Multiple Specialty Tests

If you import multiple reports of the same test type over time, the markers are matched to existing custom marker definitions. This gives you trend tracking across specialty labs just like standard blood work.

::: warning Model consistency
Use the same AI model for all imports of a given test type. Different models may generate different marker keys for the same test, which prevents proper trend tracking. See [AI Providers](./ai-providers.md#model-consistency) for details.
:::
