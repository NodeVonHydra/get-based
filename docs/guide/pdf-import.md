# PDF Import

getbased can read any lab report PDF — any format, any lab, any language, any country. Drop the file on the dashboard and the AI extracts all your results automatically.

## Before You Start

You need an AI provider configured in **Settings → AI Provider**. If you haven't done this yet, see [AI Providers](./ai-providers.md) first.

## How to Import

1. Open the getbased dashboard
2. Drag your lab PDF and drop it onto the **drop zone** at the top of the page
3. Wait while the AI reads and analyzes the report (typically 5–20 seconds)
4. Review the **import preview**
5. Click **Confirm** to save the results

That's it. Your data appears in charts immediately after confirming.

## Pre-Flight Checks

Before the AI processes your PDF, getbased runs automatic checks:

- **Model mismatch** — if you've changed your AI model since the last import, a warning explains that different models may generate different marker keys. You can continue or switch back
- **PII scan** — a notification confirms that personal information will be stripped before sending to the AI

These checks help prevent data consistency issues and keep you informed about privacy.

## The Import Preview

Before anything is saved, getbased shows you exactly what it found:

- **Green — Matched**: Markers recognized and mapped to a known biomarker (e.g., glucose, TSH, ferritin)
- **Blue — New**: Markers not in the built-in list, auto-created as [custom markers](./custom-markers.md) with AI-suggested names and reference ranges
- **Yellow — Unmatched**: Results the AI found but could not confidently identify — these are skipped

Review the preview carefully. You can dismiss the import if something looks wrong and try again.

::: tip Any language, any format
getbased handles reports from any country. The AI understands marker names in English, French, German, Spanish, Dutch, and many other languages, and maps them to the correct biomarkers regardless of the name used.
:::

## Specialty Labs

getbased automatically detects non-blood tests — OAT, DUTCH, HTMA, amino acids, and more. The AI identifies the test type and routes markers through the specialty pipeline with your lab's stated reference ranges. See [Specialty Labs](./specialty-labs.md) for full details.

## What Gets Extracted

getbased tracks 287+ biomarkers across 16 categories:

- Biochemistry (glucose, liver enzymes, kidney markers, electrolytes)
- Hormones (testosterone, estradiol, cortisol, DHEA, insulin, and more)
- Lipids (cholesterol, triglycerides, LDL, HDL, ratios)
- Hematology (CBC, red and white cell indices)
- Thyroid (TSH, T3, T4, antibodies)
- And 11 more categories

Markers not in the built-in schema are automatically created as custom markers and tracked alongside the built-in ones.

## Privacy During Import

Your PDF is processed locally first. Personal information (name, address, date of birth, ID numbers) is stripped out before anything is sent to your AI provider. See [PII Obfuscation](./pii-obfuscation.md) for full details on how this works.

## Common Questions

**Can I import the same PDF twice?**
If you import a report for a date that already has data, the new values are merged with existing ones for that date. Existing values are not overwritten.

**What if results are missing from the preview?**
Some PDFs use image-based scans rather than text. The AI can only extract text that pdf.js can read. Try a PDF exported directly from your lab's portal rather than a scanned photo if possible.

**Can I undo an import?**
Not directly after confirming, but you can export your data as JSON before importing (as a backup), or use **Settings → Backup & Restore** to roll back to an automatic snapshot.
