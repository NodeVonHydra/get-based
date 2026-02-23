# AI Providers

Lab Charts supports four AI backends for PDF import, chat, and dashboard AI features. You can switch between them at any time in **Settings → AI Provider**.

## Which Features Need an AI Provider?

| Feature | Requires AI? |
|---|---|
| PDF import | Yes |
| AI chat panel | Yes |
| Focus card (dashboard insight) | Yes |
| Health status dots on context cards | Yes |
| AI-generated card tips | Yes |
| Charts, tables, trend alerts | No |
| Manual entry | No |
| JSON export / import | No |
| Correlations, compare dates | No |
| Marker glossary | No |

All non-AI features work fully without any provider configured.

## The Four Providers

### Anthropic (Recommended for accuracy)

Direct access to Claude models via the Anthropic API. Claude was specifically designed to be helpful with medical and scientific information, making it the most accurate choice for interpreting lab data.

**Setup:**
1. Get an API key at [console.anthropic.com](https://console.anthropic.com)
2. In Settings → AI Provider, select **Anthropic**
3. Paste your API key
4. Choose a model from the dropdown (the app fetches available models automatically)

::: tip Pay per use
Anthropic charges per token. A typical PDF import costs a few cents. Chat responses cost fractions of a cent each.
:::

### OpenRouter (Best flexibility)

A model marketplace that gives you access to 200+ models — Claude, GPT, Gemini, DeepSeek, Grok, Qwen, and more — through a single API key. Lab Charts shows a curated list of the latest medically capable models and displays live pricing for each.

**Setup:**
1. Get an API key at [openrouter.ai](https://openrouter.ai)
2. In Settings → AI Provider, select **OpenRouter**
3. Paste your API key
4. Choose a model from the curated dropdown

::: tip Pay with card or crypto
OpenRouter supports both payment methods. You only pay for what you use.
:::

### Venice AI (Best for privacy)

A privacy-focused cloud provider where your conversations and data are not stored or logged on their servers. Venice also proxies access to GPT, Grok, and DeepSeek models.

**Setup:**
1. Get an API key at [venice.ai](https://venice.ai)
2. In Settings → AI Provider, select **Venice**
3. Paste your API key
4. Choose a model from the dropdown

### Ollama (Fully local)

Run a language model entirely on your own machine. Nothing is sent over the network — not even for PDF import. Ollama is free and works offline once the model is downloaded.

**Setup:**
1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Pull a model, e.g.: `ollama pull llama3`
3. In Settings → AI Provider, select **Ollama**
4. Enter your Ollama server URL (default: `http://localhost:11434`)
5. Choose your downloaded model

::: tip Ollama also handles PII stripping
When Ollama is running, it is used to intelligently strip personal information from PDFs before analysis — no regex needed. See [PII Obfuscation](./pii-obfuscation.md) for details.
:::

::: warning Ollama requires a capable model
Smaller models (under ~7B parameters) may struggle with accurate marker extraction from complex lab PDFs. A 13B+ model is recommended for best results.
:::

## Switching Providers

You can switch providers at any time in Settings without losing any data. Your API keys are stored locally in your browser and are never sent to Lab Charts servers.
