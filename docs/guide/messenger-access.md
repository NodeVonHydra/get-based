# Messenger Access

Messenger Access is an opt-in feature that lets AI bots query your lab data over any messenger — Matrix, Signal, Telegram, Discord, or anything else that supports tool-using agents. You chat with a bot in the app you already use, and it pulls your latest lab context from getbased to answer questions like "how's my iron trending?" or "what changed since my last draw?"

Only a read-only text summary is shared. Your raw data and sync mnemonic never leave your browser.

## How It Works

```
getbased (browser)  ──saves context──▶  Context Gateway  ◀──queries with token──  AI bot (Matrix, Signal, etc.)
```

1. You enable **Messenger Access** in getbased and receive a read-only token
2. getbased pushes a pre-built text summary of your labs, context cards, supplements, goals, and notes to the context gateway
3. Your AI bot uses the token to read that summary and answer questions in your messenger

The gateway stores only the same assembled text context that the in-app AI chat uses — no raw data, no database access, no mnemonic. The summary is refreshed automatically whenever you save changes in getbased.

## Setup

### 1. Enable Messenger Access

1. Open **Settings → Data → Messenger Access**
2. Toggle it **on**
3. A read-only token is generated and displayed

Copy the token — you will paste it into your bot's configuration.

### 2. Connect your bot

Paste the token into whichever tool you use to run your AI bot. See [Compatible Tools](#compatible-tools) below for specific instructions.

### 3. Chat

Ask your bot anything about your labs. It reads your latest context from the gateway and responds in your messenger.

::: tip Token visibility
The token is masked by default in Settings. Click **Show** to reveal it, or **Copy** to put it on your clipboard. The clipboard is cleared after 60 seconds.
:::

## Multi-Profile Support

If you track labs for multiple people (yourself, a partner, a parent), each profile's context is stored separately on the gateway. Bots can query by profile ID to pull the right person's data.

- When you save context, getbased pushes each profile's summary under its own ID
- The bot's `getbased_list_profiles` tool returns all available profiles with their names
- The bot's `getbased_lab_context` tool accepts an optional profile ID parameter — if omitted, it returns the active profile

Switch to the profile you want to update in getbased, make your changes, and the gateway receives that profile's latest context automatically.

## Compatible Tools

Messenger Access works with any agent or plugin that can call the context gateway's API using your token. Two official integrations exist:

### getbased-mcp

An [MCP (Model Context Protocol)](https://github.com/elkimek/getbased-mcp) server that exposes your lab context as tools to any MCP-compatible AI agent — Claude Desktop, Cursor, custom agent frameworks, and more. If your agent speaks MCP, this is the universal adapter.

```bash
git clone https://github.com/elkimek/getbased-mcp.git
cd getbased-mcp
npm install && npm run build
```

Add it to your agent's MCP config with your token and gateway URL.

### getbased-openclaw

An [OpenClaw plugin](https://github.com/elkimek/getbased-openclaw) for self-hosted OpenClaw bots connected to any messenger. See the dedicated [OpenClaw guide](/guide/openclaw) for full setup instructions.

```bash
cd ~/.openclaw/plugins
git clone https://github.com/elkimek/getbased-openclaw.git
cd getbased-openclaw
npm install && npm run build
```

Both tools provide the same two capabilities:

| Tool | Description |
|---|---|
| `getbased_lab_context` | Full lab summary — values, ranges, trends, context cards, supplements, goals |
| `getbased_list_profiles` | List all profiles by name and ID |

## Security

Messenger Access is designed to share the minimum needed for a bot to be useful:

- **Read-only token** — the token grants access to a pre-built text summary only. No writes, no database queries, no mutations
- **No raw data exposed** — the gateway stores the same assembled context the in-app AI chat uses, not your underlying lab entries or personal records
- **Mnemonic never leaves your browser** — the sync mnemonic is a separate system. Messenger Access does not use or transmit it
- **Revocable at any time** — toggle Messenger Access off in Settings to immediately invalidate the token. You can also click **Regenerate** to create a new token, which invalidates the old one
- **Self-hostable** — the context gateway runs on the same server as the [sync relay](./cross-device-sync.md#running-your-own-relay). Self-host both for full control over where your summary is stored

::: warning
Your token grants access to your lab summary. Treat it like a password — do not share it publicly or commit it to a public repository.
:::

## Troubleshooting

### Bot sees the wrong profile

The gateway serves whichever profiles have been pushed. If the bot returns data for the wrong person:

1. Open getbased and switch to the correct profile
2. Make any edit and save (or toggle Messenger Access off and back on) to force a fresh push
3. Ask the bot again — use the profile ID parameter if you have multiple profiles

### Bot returns stale data

The gateway is updated whenever you save changes in getbased. If the bot's answers seem outdated:

1. Confirm **Messenger Access** is still toggled on in **Settings → Data**
2. Open getbased in your browser — the push happens from the browser, so it needs to be open at least once after your latest changes
3. Check your network connection — the push requires internet access to reach the gateway

### Token not working

- Make sure you copied the full token (no trailing spaces)
- Check that Messenger Access is still enabled — disabling it invalidates the token
- If you clicked **Regenerate**, update your bot config with the new token — the old one no longer works

### Bot cannot reach the gateway

If you self-host the gateway, verify that:

- The gateway server is running and accessible from the bot's network
- Your bot config points to the correct gateway URL (e.g., `https://sync.yourdomain.com`)
- TLS is configured correctly — the bot needs HTTPS access
