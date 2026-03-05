# PII Obfuscation

When you import a lab PDF, getbased strips out your personal information before the text is sent to any AI provider. Your name, address, date of birth, ID numbers, and contact details are replaced with fake placeholder data. The AI only ever sees the lab results themselves.

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

### Regex (Always active)

getbased always runs a rule-based scan on the PDF text. It looks for known PII patterns (label-based detection for fields like "Name:", "Address:", "DOB:", and pattern-based detection for ID formats, emails, and phone numbers) and replaces them automatically.

The regex approach is fast and works without any local software, but may miss unusual formatting that the local AI approach would catch.

### Local AI (Opt-in)

If you have a [local AI server](./ai-providers.md#local-ai-fully-local) running (Ollama, LM Studio, Jan, or any OpenAI-compatible server), you can enable AI-powered PII stripping in **Settings → Privacy**. When enabled, a dedicated language model reads the full PDF text, identifies personal information contextually, and replaces it with realistic fake data.

This method is more accurate than regex — it catches edge cases like names embedded in unusual places — and runs entirely on your machine. Nothing is sent anywhere during the obfuscation step.

::: tip Separate PII model
You can configure a separate model specifically for PII stripping in **Settings → Privacy → Configure Local AI**. This lets you use a small, fast model for obfuscation and a larger, more capable model for the actual lab analysis.
:::

## Configure PII Settings

Open **Settings → Privacy** to:

- Toggle local AI PII obfuscation on or off
- Configure the server URL and PII model
- Enable the review editor to inspect and edit obfuscated text before sending
- Enable debug mode to view a diff of what was replaced

::: warning Your AI provider still receives text
Even with PII obfuscation, the anonymized lab text is sent to your configured AI provider (Anthropic, OpenRouter, or Venice) for marker extraction. The obfuscation step ensures that text contains no personal identifiers. If you want nothing sent over the network at all, use a local server as both your PII model and your main AI provider.
:::
