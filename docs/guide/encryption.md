# Encryption

Get Based stores all your data locally in your browser — nothing is uploaded to any server (except what you deliberately send to an AI provider). On top of that, you can enable encryption at rest to protect your data with a passphrase.

## Local Storage

All your lab data, context cards, notes, supplements, and settings live in your browser's **localStorage** and **IndexedDB**. No account is required. No data is synced to the cloud. Clearing your browser data will erase Get Based data, so use the export and backup features regularly.

## Encryption at Rest

When you set a passphrase in **Settings → Security**, your data is encrypted before being written to localStorage using:

- **AES-256-GCM** — authenticated encryption that protects both confidentiality and integrity
- **PBKDF2** key derivation — your passphrase is never stored directly; it is stretched into a cryptographic key

When you open Get Based, you are prompted for your passphrase to decrypt and load your data. Without the correct passphrase, the data is unreadable.

::: warning
There is no passphrase recovery. If you forget your passphrase, your data cannot be decrypted. Make sure to export a plaintext JSON backup before enabling encryption, or store your passphrase somewhere safe.
:::

## Automatic Backups

Get Based automatically backs up your data using **IndexedDB** as a secondary storage layer. Backups happen in the background:

- A backup is triggered 60 seconds after any data change (debounced — rapid changes only trigger one backup)
- Up to **5 snapshots** are stored; the oldest is pruned when a new one is added
- Each snapshot includes all your lab entries, context cards, notes, supplements, cycle data, and per-profile preferences

## Restoring a Backup

Go to **Settings → Backup & Restore** to see your saved snapshots. Each entry shows the date and time it was created. Click **Restore** next to any snapshot to:

1. See a confirmation prompt
2. Write that snapshot back to localStorage
3. Reload the app with the restored data

This is useful if you accidentally clear data, import a bad file, or just want to roll back to an earlier state.

::: tip
You can also restore a backup even without a passphrase configured — backups follow the same encryption state as your main data at the time they were created.
:::

## Manual Export

For an additional safety net, use **Export JSON** in the Data & Notes section to download a plaintext copy of all your data at any time. Store it somewhere safe (a password manager, encrypted drive, or offline backup). See [JSON Export & Import](/guide/json-export-import) for details.

## What Is and Is Not Encrypted

When encryption is enabled, the following are encrypted:
- All imported lab data (entries, notes, supplements, cycle data, context cards)
- Chat conversation history
- Custom personality settings

Settings such as your chosen AI provider and theme are stored in plaintext (they contain no health data).

AI API requests are always transmitted to your chosen provider over HTTPS, regardless of your encryption setting. Your provider's privacy policy governs how they handle those requests.
