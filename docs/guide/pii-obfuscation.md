# PII Obfuscation

When you import a lab PDF, Lab Charts strips out your personal information before the text is sent to any AI provider. Your name, address, date of birth, ID numbers, and contact details are replaced with fake placeholder data. The AI only ever sees the lab results themselves.

## What Gets Stripped

The obfuscation process targets:

- Full name and any name-adjacent labels
- Home address and postal code
- Date of birth (separate from collection dates, which are preserved)
- National ID numbers, social security numbers, patient IDs
- Email addresses and phone numbers
- Other personally identifiable labels detected in the text

Lab result lines and collection dates are specifically protected and left intact.

## Two Obfuscation Methods

### Ollama (Preferred)

If you have [Ollama](./ai-providers.md#ollama-fully-local) running locally, Lab Charts uses it to intelligently strip PII. A dedicated language model reads the full PDF text, identifies personal information contextually, and replaces it with realistic fake data.

This method is more accurate than regex — it catches edge cases like names embedded in unusual places — and runs entirely on your machine. Nothing is sent anywhere during the obfuscation step.

Lab Charts detects Ollama automatically. If it's running, PII stripping via Ollama happens silently in the background.

::: tip Separate PII model
You can configure a separate Ollama model specifically for PII stripping in **Settings → PDF Import Privacy**. This lets you use a small, fast model for obfuscation and a larger, more capable model for the actual lab analysis.
:::

### Regex Fallback

If Ollama is not available, Lab Charts falls back to a rule-based approach. It scans the PDF text for known PII patterns (label-based detection for fields like "Name:", "Address:", "DOB:", and pattern-based detection for ID formats, emails, and phone numbers) and replaces them automatically.

The regex approach is fast and works without any local software, but may miss unusual formatting that the Ollama approach would catch.

## First-Time Warning

If you drop a PDF and Ollama is not running, Lab Charts shows a one-time warning explaining that the regex fallback will be used. You can choose to continue or cancel and set up Ollama first. This warning appears once per browser session.

## Configure PII Settings

Open **Settings → PDF Import Privacy** to:

- See which obfuscation method is currently active (Ollama or regex)
- Configure the Ollama server URL and PII model
- Enable debug mode to view a diff of what was replaced (useful for verifying the obfuscation worked correctly)

::: warning Your AI provider still receives text
Even with PII obfuscation, the anonymized lab text is sent to your configured AI provider (Anthropic, OpenRouter, or Venice) for marker extraction. The obfuscation step ensures that text contains no personal identifiers. If you want nothing sent over the network at all, use Ollama as both your PII model and your main AI provider.
:::
