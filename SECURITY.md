# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in getbased, please report it privately via [GitHub Security Advisories](https://github.com/elkimek/get-based/security/advisories/new).

Do **not** open a public issue for security vulnerabilities.

I'll acknowledge receipt within 48 hours and aim to release a fix within 7 days for critical issues.

## Scope

- Application code (HTML, CSS, JavaScript)
- Data handling (localStorage, encryption, PII obfuscation)
- AI API key management
- Cross-device sync (Evolu relay)
- PDF import pipeline

## Out of Scope

- Third-party AI provider APIs (report directly to the provider)
- Self-hosted relay infrastructure (report to the relay operator)
- Browser vulnerabilities

## Data Architecture

getbased is a client-side application. All health data stays in your browser (localStorage + IndexedDB). There is no server-side database. Optional cross-device sync uses E2E encrypted CRDT replication — the relay only sees ciphertext.

API keys are stored in the browser via `encryptedSetItem` (AES-256-GCM) when encryption is enabled.
