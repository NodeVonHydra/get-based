# Cross-Device Sync

getbased can sync your profiles, lab data, and AI settings across multiple devices using end-to-end encrypted CRDT sync. The relay server only sees ciphertext — your data is encrypted before it leaves your browser.

## How It Works

Sync is powered by [Evolu](https://www.evolu.dev/), a local-first CRDT (Conflict-free Replicated Data Type) engine. When you enable sync:

1. A **24-word mnemonic** is generated — this is your sync identity and encryption key
2. Your data is encrypted with a key derived from this mnemonic and pushed to a relay server
3. Other devices using the same mnemonic can pull and decrypt your data

The relay server stores only encrypted blobs. Without your mnemonic, the data is unreadable.

## Setting Up Sync

### First Device (New Setup)

1. Open **Settings → Data**
2. Toggle **Cross-device sync** on
3. In the setup modal, click **New setup**
4. Your 24-word mnemonic is displayed in cleartext — **write it down and store it offline**
5. Check "I have saved my mnemonic somewhere safe"
6. Click **Done**

Your data is now syncing to the relay. All profiles are pushed automatically.

### Additional Devices (Join Existing)

1. Open **Settings → Data**
2. Toggle **Cross-device sync** on
3. In the setup modal, click **Join existing**
4. Paste your 24-word mnemonic from your first device
5. Click **Restore**

The page reloads and pulls your data from the relay. All profiles and AI settings sync over.

::: warning
Anyone with your mnemonic can access your synced data. Treat it like a password — store it offline, never share it.
:::

## What Syncs

- All profile data (lab entries, context cards, notes, supplements, cycle data, custom markers, EMF assessments)
- Profile metadata (name, sex, DOB, location, tags)
- AI settings (provider, API keys, model selections, Venice E2EE toggle)

Settings such as theme, unit system, and display preferences are device-specific and do not sync.

## Mnemonic Security

Your mnemonic is your encryption key. getbased takes several precautions:

- **Masked by default** — shown as bullet characters in Settings, with a Show/Hide toggle
- **Clipboard auto-clear** — when you copy the mnemonic, the clipboard is cleared after 60 seconds
- **No server storage** — the mnemonic is generated and stored locally by the Evolu engine, never sent to any server

::: danger No recovery
If you lose your mnemonic, there is no way to recover your sync identity. You can still access your local data, but you will need to set up sync again with a new mnemonic on all devices.
:::

## Conflict Resolution

Sync uses **last-write-wins** at the profile level, based on timestamps. This is designed for single-user, multi-device use — one person using getbased on their phone and laptop. If you edit the same profile on two devices simultaneously before they sync, the most recent push wins.

## Advanced: Relay Server

By default, sync connects to `wss://free.evoluhq.com` (Evolu's public relay). You can change this in **Settings → Data → Advanced** to point to your own relay if you prefer to self-host.

## Relationship to Encryption

Cross-device sync and [local encryption](./encryption.md) are independent systems:

- **Local encryption** (passphrase → AES-256-GCM) protects your localStorage data at rest on each device
- **Sync encryption** (mnemonic → Evolu's key derivation → XChaCha20-Poly1305) protects data in transit and on the relay

You can use either, both, or neither. Enabling local encryption does not affect sync, and vice versa.
