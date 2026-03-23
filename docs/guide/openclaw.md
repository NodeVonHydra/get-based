# OpenClaw

[OpenClaw](https://openclaw.ai) is a self-hosted AI assistant you can connect to any messenger (Telegram, Signal, Discord, etc.). The getbased plugin lets your OpenClaw bot answer questions about your blood work — "what's my vitamin D trend?" or "summarize my last labs" — directly in chat.

Only a read-only summary is shared. Your raw data and sync mnemonic never leave your browser.

## How It Works

```
getbased (browser) → Context Gateway ← OpenClaw bot
```

1. You enable **OpenClaw access** in getbased and get a read-only token
2. getbased pushes a text summary of your labs, context cards, supplements, and goals to the context gateway (same server as the sync relay)
3. Your OpenClaw bot uses the token to read that summary and answer questions

The gateway stores only the pre-built text context — the same text the in-app AI chat uses. No raw data, no database access, no mnemonic.

## Setup

### 1. Enable in getbased

Go to **Settings → Data → OpenClaw** and toggle it on. A read-only token is generated.

### 2. Install the plugin

```bash
cd ~/.openclaw/plugins
git clone https://github.com/elkimek/getbased-openclaw.git
cd getbased-openclaw
npm install && npm run build
```

### 3. Connect the token

Copy the token from getbased and run:

```bash
openclaw getbased-setup
```

Paste the token when prompted. The setup command verifies it works and saves it to your OpenClaw config.

### 4. Chat

Ask your bot anything about your labs. The plugin provides two tools the AI can use:

- **getbased_lab_context** — full lab summary with values, ranges, trends, context cards, supplements, and goals
- **getbased_list_profiles** — list all profiles (if you track multiple people)

## Security

- The token grants **read-only** access to a pre-built text summary
- Your sync mnemonic is never shared
- Revoking the token (toggle off or regenerate) immediately cuts access
- The context gateway runs on the same server as the sync relay — self-host both for full control

## Self-Hosting

The context gateway is a lightweight Node.js server. If you [self-host your sync relay](./cross-device-sync.md#running-your-own-relay), the gateway runs alongside it on the same VPS. Point your plugin config to your own gateway:

```json
{
  "plugins": {
    "entries": {
      "getbased": {
        "config": {
          "token": "your-token",
          "gateway": "https://sync.yourdomain.com"
        }
      }
    }
  }
}
```
