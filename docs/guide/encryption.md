# Encryption

getbased stores all your data locally in your browser — nothing is uploaded to any server (except what you deliberately send to an AI provider). On top of that, you can enable encryption at rest to protect your data with a passphrase.

## Local Storage

All your lab data, context cards, notes, supplements, and settings live in your browser's **localStorage** and **IndexedDB**. No account is required. No data is synced to the cloud. Clearing your browser data will erase getbased data, so use the export and backup features regularly.

## Encryption at Rest

When you set a passphrase in **Settings → Security**, your data is encrypted before being written to localStorage using:

- **AES-256-GCM** — authenticated encryption that protects both confidentiality and integrity
- **PBKDF2** key derivation — your passphrase is never stored directly; it is stretched into a cryptographic key

When you open getbased, you are prompted for your passphrase to decrypt and load your data. Without the correct passphrase, the data is unreadable.

::: warning
There is no passphrase recovery. If you forget your passphrase, your data cannot be decrypted. Make sure to export a plaintext JSON backup before enabling encryption, or store your passphrase somewhere safe.
:::

### Passphrase Requirements

Passphrases must meet all four rules:

- At least **8 characters**
- At least **1 lowercase** letter
- At least **1 uppercase** letter
- At least **1 special character** (`!@#$%^&*` etc.)

A live strength meter with a color-coded bar and checklist shows your progress as you type. The encryption button is disabled until all rules pass.

### Encryption Nudge

After your first PDF import, getbased shows a one-time prompt suggesting you enable encryption. This is a reminder, not a requirement — you can dismiss it and enable encryption later from Settings.

## Three Backup Layers

getbased protects your data with three independent backup mechanisms:

### 1. IndexedDB Auto-Backup

Automatic in-browser snapshots happen in the background:

- A backup is triggered 60 seconds after any data change (debounced — rapid changes only trigger one backup)
- Up to **5 snapshots** are stored; the oldest is pruned when a new one is added
- Each snapshot includes all your lab entries, context cards, notes, supplements, cycle data, and per-profile preferences

Go to **Settings → Data → Backup & Restore** to see your saved snapshots. Each entry shows the date and time it was created. Click **Restore** next to any snapshot to roll back.

### 2. Folder Backup

Auto-save to a local folder on your computer — Proton Drive, Dropbox, NAS, or any location you trust. This uses the File System Access API (Chromium browsers only). See [Folder Backup](./folder-backup.md) for full details.

### 3. Manual JSON Export

Download a plaintext copy of all your data at any time. Store it somewhere safe (a password manager, encrypted drive, or offline backup). See [JSON Export & Import](./json-export-import.md) for details.

### Backup Reminder

If you haven't configured folder backup and haven't manually exported in over 30 days, getbased shows a gentle reminder nudge. You can snooze it for another 30 days or set up folder backup to dismiss it permanently.

::: tip
You can restore a backup even without a passphrase configured — backups follow the same encryption state as your main data at the time they were created.
:::

## What Is and Is Not Encrypted

When encryption is enabled, the following are encrypted:
- All imported lab data (entries, notes, supplements, cycle data, context cards)
- Chat conversation history
- Custom personality settings

Settings such as your chosen AI provider and theme are stored in plaintext (they contain no health data).

AI API requests are always transmitted to your chosen provider over HTTPS, regardless of your encryption setting. Your provider's privacy policy governs how they handle those requests.

## Venice End-to-End Encryption (E2EE)

When using Venice AI as your provider, you can enable **End-to-End Encryption** in Venice settings. This encrypts your prompts in the browser before transmission using:

- **ECDH (secp256k1)** key exchange with the model's TEE attestation key
- **HKDF-SHA256** key derivation
- **AES-256-GCM** message encryption

With E2EE enabled, your prompts are encrypted before leaving the browser and are only decrypted inside a verified Trusted Execution Environment — not even Venice can read them. Response chunks are encrypted per-chunk by the TEE and decrypted in your browser.

::: warning E2EE trade-offs
E2EE mode disables web search and image attachments. Only a subset of Venice models support E2EE. A lock icon (🔒) in the chat header and message footer confirms when E2EE is active.
:::
