# PII Obfuscation

When you import a lab PDF, getbased strips out your personal information before the text is sent to any AI provider. Your name, address, date of birth, ID numbers, and contact details are replaced with fake placeholder data. The AI only ever sees the lab results themselves.

## What Gets Stripped

The obfuscation process targets:

- Full name and any name-adjacent labels
- Home address and postal code
- Date of birth (separate from collection dates, which are preserved)
- National ID numbers, social security numbers, patient IDs
- Email addresses and phone numbers
- US lab identifiers — Specimen ID, Accession No, Account No, MRN, Member ID
- Other personally identifiable labels detected in the text

Lab result lines and collection dates are specifically protected and left intact.

## Two Obfuscation Methods

### Regex (Always active)

getbased always runs a rule-based scan on the PDF text. It looks for known PII patterns (label-based detection for fields like "Name:", "Address:", "DOB:", and pattern-based detection for ID formats, emails, and phone numbers) and replaces them automatically.

The regex approach is fast and works without any local software, but may miss unusual formatting that the local AI approach would catch.

### Local AI (Opt-in)

If you have a [local AI server](./ai-providers.md#local-ai-fully-local) running (Ollama, LM Studio, Jan, or any OpenAI-compatible server), you can enable AI-powered PII stripping in **Settings → Privacy**. When enabled, a dedicated language model reads the full PDF text, identifies personal information contextually, and replaces it with realistic fake data.

This method is more accurate than regex — it catches edge cases like names embedded in unusual places — and runs entirely on your machine. Nothing is sent anywhere during the obfuscation step.

::: tip Separate PII model
You can configure a separate model specifically for PII stripping in **Settings → Privacy → Configure Local AI**. This lets you use a small, fast model for obfuscation and a larger, more capable model for the actual lab analysis.
:::

## Review Editor

When both Local AI PII and the review editor are enabled, the review modal opens **immediately** when you import a PDF. The AI obfuscation streams into the right panel in real-time so you can watch the replacement happen:

- **Progress indicator** — a pulsing green dot while the model loads, then a percentage counter as text streams in
- **Word-level diffs** — after streaming completes, both panels show highlighted differences: red for removed words on the left, green for added words on the right. Click the right panel to switch into edit mode
- **Auto-search** — the patient name from the original PDF is auto-filled into the search bar so you can instantly verify it was replaced
- **Edit freely** — the right panel becomes editable after streaming. The button changes to "Save & Send to AI" when you make changes
- **Thinking tokens** — models that emit `<think>` tags or `reasoning_content` have their thinking stripped from the obfuscated output and shown in a collapsible section below the diff
- **Stop** — cancel the stream mid-way and edit the partial result. The model is unloaded from VRAM when you click Stop, Cancel, or "Use regex instead"
- **Retry** — re-run the AI obfuscation if the result looks wrong (appears after stop or error)
- **Use regex instead** — switch to the fast rule-based method at any point

Background scroll is locked while the review modal is open.

Without Local AI, the review editor shows the regex result directly for editing.

## Configure PII Settings

Open **Settings → Privacy** to:

- Toggle local AI PII obfuscation on or off
- Configure the server URL and PII model
- Enable the review editor to inspect and edit obfuscated text before sending
- Enable debug mode to view a diff of what was replaced

::: tip Local AI requirements
When using the hosted app (`app.getbased.health`), the Local AI server must run on **localhost** — LAN servers are blocked by HTTPS mixed content rules. For Ollama, start with `OLLAMA_ORIGINS=* ollama serve` to allow cross-origin requests from the app.
:::

::: warning Your AI provider still receives text
Even with PII obfuscation, the anonymized lab text is sent to your configured AI provider (Anthropic, OpenRouter, or Venice) for marker extraction. The obfuscation step ensures that text contains no personal identifiers. If you want nothing sent over the network at all, use a local server as both your PII model and your main AI provider.
:::
