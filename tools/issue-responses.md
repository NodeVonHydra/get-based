# Issue Responses — Jonseed Followups Batch 3

Post these after pushing the branch.

---

## #44 — Manually add biomarkers and values
**Action: Comment, let him close**

The issue here is HealthierOne's 283-marker report itself. getbased's standard schema covers ~150 common blood markers. HealthierOne goes way beyond that — it's a kitchen-sink report mixing blood, urine, and functional markers across 28 pages. The AI tries to map what it can, but for a report this comprehensive, the results are unreliable and not worth the AI costs.

**How this is addressed from now on**:

- **Pre-import detection** — before spending any AI credits, getbased now identifies the report type and warns you if it's not well supported. You'll see a clear message with the option to cancel or proceed anyway.
- **Post-import quality warning** — if you proceed and many markers can't be mapped, a warning banner appears in the import preview so you know what you're working with.

The proper fix for HealthierOne is **dedicated support** — a curated mapping of every marker with correct reference ranges. The architecture for this exists (it's how Spadia, OAT, and Metabolomix+ work). If more users need a specific lab supported, I'm happy to build it — just open an issue or have the lab reach out.

---

## #46 — Real-time diff highlighting on Review & Edit modal
**Action: Close with comment**

Thanks for the suggestion! I see the appeal — being able to see the highlights while editing would be smoother.

In practice though, the PII review is a quick safety check: scan the diff to verify your personal info is gone, maybe fix a missed name or two, and send. Most users spend just a few seconds there. The diff view already makes it clear what was changed, so by the time you switch to edit mode, you know exactly what you're looking for.

Building live highlighting inside an editable text area is surprisingly involved and would add a lot of moving parts to what's meant to be a simple, reliable step. For now I'd rather keep it lean and focus on things that affect more of the workflow.

If it becomes a pain point for more users I'm happy to revisit.

---

## #45 — Review & Edit panel cursor placement and scroll jump
**Action: Close with comment**

Fixed — the Review & Edit panel no longer scrolls to the bottom when you switch to edit mode, and the diff view is now read-only (you need to click the Edit button to make changes, so you can scroll and review without accidentally entering edit mode).

---

## #47 — Custom model pricing not updating
**Action: Close with comment**

Fixed — when you enter a custom model ID and press Enter, getbased now fetches the actual pricing from OpenRouter and updates the display. Free models show "Free" in green. Also tidied up the UI: the custom input is more compact, and the dropdown shows "Using custom model" when a custom ID is active instead of going blank.

---

## #48 — "Ask AI about this marker" shows wrong reference range
**Action: Close with comment**

Fixed — "Ask AI about this marker" now always sends the actual reference range to the AI, regardless of which range mode (reference/optimal/both) you have selected on the dashboard. The optimal range is sent separately when available, so the AI can distinguish between the two.

---

## #49 — "Model returned invalid JSON that could not be repaired"
**Action: Close with comment**

This was most likely caused by thinking models (DeepSeek R1, QwQ, etc.) — they wrap their reasoning in `<think>...</think>` tags before the actual JSON output, which broke the parser. Fixed — those tags are now stripped before parsing.

Also made the error notification stay visible for 10 seconds instead of 3, so you won't miss it if you've switched tabs.

If you're still hitting JSON failures after this update with a specific model, let me know which one — some smaller models just can't reliably produce the structured output this needs.

---

## #50 — Edited ranges show "lab" badge instead of "edited"
**Action: Close with comment**

Fixed — manually edited ranges now show "edited ×" and imported lab ranges show "lab ×". The badge also has a more descriptive tooltip for each case.

---

## #51 — Percentage biomarkers importing with wrong ranges
**Action: Close with comment**

Fixed — percentage markers like Neutrophils %, Lymphocytes %, and Monocytes % now import with correct reference ranges. The issue was that the AI could return the ranges in a format the converter didn't recognize, leading to a ×100 display error. The marker reference sent to the AI now uses display-friendly units to avoid the ambiguity.

---

## #52 — Custom markers missing ranges, no way to edit after creation
**Action: Close with comment**

Fixed — custom markers without reference or optimal ranges now show a clickable "Reference: – – –" placeholder in the detail modal. Click it to add ranges. In "both" mode you can set both reference and optimal ranges for custom markers.

---

## #34 — Open-ended reference/optimal ranges
**Action: Close with comment**

Fixed — you can now set open-ended ranges (like eGFR >59). Click the range to edit, then use the × button to clear the min or max bound. The chart draws a solid line at the threshold with shading on the in-range side. One-sided ranges from lab PDFs are also preserved on import now (previously the open side would fall back to the schema default).

---

## #39 — Keep each PDF import separate under "import data" in settings
**Action: Comment, don't close**

Improved the visibility side — when multiple PDFs are imported on the same date, the Settings Data tab now shows "2 files" (hover to see all filenames). Previously the latest filename silently overwrote the earlier one.

Separating entries per PDF would require a significant architectural change — the entire data pipeline, manual entry, inline editing, value deletion, and export/import all key on date. Reworking that carries a lot of risk for existing data and would need careful migration. Keeping this open but it's not something I'd rush into.
