# AI Providers

getbased supports four AI backends for PDF import, chat, and dashboard AI features. You can switch between them at any time in **Settings → AI**.

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

### OpenRouter (Recommended)

A model marketplace that gives you access to 200+ models — Claude, GPT, Gemini, DeepSeek, Grok, Qwen, and more — through a single account. getbased shows a curated list of the latest medically capable models and displays live pricing for each. OpenRouter is the recommended provider and appears as the first tab in Settings.

**Setup — OAuth (easiest):**
1. In Settings → AI Provider, select **OpenRouter**
2. Click **Connect with OpenRouter**
3. Authorize getbased on the OpenRouter site
4. You're connected — no API key needed

**Setup — API key:**
1. Get an API key at [openrouter.ai](https://openrouter.ai)
2. In Settings → AI Provider, select **OpenRouter**
3. Paste your API key
4. Choose a model from the curated dropdown, or type any model ID into the custom input field below it (a health check confirms connectivity)

::: tip One-click connect
The OAuth button also appears in the chat setup guide when no provider is configured, making it easy for new users to get started.
:::

### Anthropic

Direct access to Claude models via the Anthropic API. Claude was specifically designed to be helpful with medical and scientific information, making it an accurate choice for interpreting lab data.

**Setup:**
1. Get an API key at [console.anthropic.com](https://console.anthropic.com)
2. In Settings → AI Provider, select **Anthropic**
3. Paste your API key
4. Choose a model from the dropdown (the app fetches available models automatically)

::: tip Pay per use
Anthropic charges per token. A typical PDF import costs a few cents. Chat responses cost fractions of a cent each.
:::

### Venice AI (Best for privacy)

A privacy-focused cloud provider where your conversations and data are not stored or logged on their servers. Venice also proxies access to GPT, Grok, and DeepSeek models.

**Setup:**
1. Get an API key at [venice.ai](https://venice.ai)
2. In Settings → AI Provider, select **Venice**
3. Paste your API key
4. Choose a model from the dropdown

### Local AI (Fully local)

Run a language model entirely on your own machine. Nothing is sent over the network — not even for PDF import. Local AI connects via the standard OpenAI-compatible API (`/v1/chat/completions`), which is supported by all major local servers:

- [Ollama](https://ollama.com) — easiest setup, pull models from the command line
- [LM Studio](https://lmstudio.ai) — GUI-based, drag-and-drop model loading
- [Jan](https://jan.ai) — open-source desktop app
- llama.cpp, LocalAI, and others

**Setup:**
1. Install and start any local AI server
2. Load a model (e.g., in Ollama: `ollama pull llama3.2`)
3. In Settings → AI Provider, select **Local**
4. Enter your server URL (default: `http://localhost:11434`)
5. Click **Test** — the app auto-discovers available models
6. Add an API key if your server requires one (most don't)

::: tip Local AI also handles PII stripping
When enabled in Settings → Privacy, your local server is used to intelligently strip personal information from PDFs before analysis. See [PII Obfuscation](./pii-obfuscation.md) for details.
:::

::: tip Cross-origin access requires OLLAMA_ORIGINS
Ollama blocks requests from web pages by default. When using getbased (whether hosted or local dev server), start Ollama with:
```
OLLAMA_ORIGINS=* ollama serve
```
LM Studio, Jan, and other servers typically allow all origins by default.
:::

::: warning HTTPS limits Local AI to localhost
The hosted app at `app.getbased.health` is served over HTTPS. Browsers block HTTPS pages from making requests to plain HTTP servers on your LAN (mixed content). This means **Local AI must run on the same machine** — only `localhost` / `127.0.0.1` will work. If you need to reach a server on another device, use the local dev server (`node dev-server.js`) which runs over HTTP.
:::

::: warning Use a capable model
Smaller models (under ~7B parameters) may struggle with accurate marker extraction from complex lab PDFs. A 13B+ model is recommended for best results.
:::

## Recommended Models

All providers show a tiered model dropdown with two groups:

- **★ Recommended** — the latest, most capable models for lab interpretation (sorted first)
- **Other** — all remaining available models

Recommended models are chosen for accuracy with medical/scientific data. You can use any model, but recommended ones produce the most reliable results.

## Model Consistency

::: warning Use the same model across imports
When you import lab PDFs, the AI generates marker keys (like `biochemistry.glucose`) to map results. Different models may generate slightly different keys for the same marker. Switching models between imports can cause the same marker to appear as two separate entries.

For best results, pick a model and stick with it for all your imports. If you do switch, getbased runs a pre-flight check before each import and warns you if your model has changed since the last import.
:::

## Switching Providers

You can switch providers at any time in Settings without losing any data. Your API keys are stored locally in your browser and are never sent to getbased servers.
