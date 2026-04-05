# Tor Access

getbased is fully accessible as a Tor hidden service. When you visit the clearnet site or app using [Tor Browser](https://www.torproject.org/download/), a purple ".onion available" badge appears in the address bar — click it to switch to the .onion version.

## .onion Addresses

| Service | Address |
|---------|---------|
| **Website** | `p75tbgf5smjkrq7pqap5bkq6esrgin66q6td2lmukbxo5r3gyocfqxid.onion` |
| **App** | `iobqafpywmncin7m2wpvbemouvulaeb7jnvtvugxnru4gpneushb5jyd.onion` |
| **Sync relay** | `udou6gehyfpfccdjpibmuttaoauawmh5cgzszffnskbvczppvr2sfjad.onion` |

## What Changes on .onion

- **AI API calls** go directly to your provider (OpenRouter, Routstr, PPQ, Venice) over HTTPS — the Vercel proxy is bypassed
- **Sync relay** automatically switches to the .onion relay address (`ws://`) instead of the clearnet relay (`wss://`)
- **All app features work** — PDF import, AI chat, encryption, DNA import, everything

## Sync Across Clearnet and .onion

Your sync mnemonic works on both clearnet and .onion. The app detects which environment you're in and uses the correct relay:

- Clearnet: `wss://sync.getbased.health`
- Tor: `ws://udou6gehyfpfccdjpibmuttaoauawmh5cgzszffnskbvczppvr2sfjad.onion`

Both relay endpoints point to the same server. Data synced from clearnet is available on .onion and vice versa.

## Limitations

- **OpenRouter OAuth** requires a clearnet callback URL — use API key entry instead when on .onion
- **Umami analytics** (privacy-respecting, no cookies) is not loaded on .onion
- **AI providers are clearnet services** — your prompts travel over HTTPS to the provider. For maximum privacy, use Venice with [E2EE](./encryption.md#venice-end-to-end-encryption-e2ee) enabled
