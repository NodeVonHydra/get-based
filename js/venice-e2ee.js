// venice-e2ee.js — Venice End-to-End Encryption (ECDH secp256k1 + AES-256-GCM)
// Isolated crypto module — only imports from vendor lib + Web Crypto API

import { getPublicKey, getSharedSecret, utils } from '../vendor/noble-secp256k1.js';

let _session = null; // { privateKey, publicKey, pubKeyHex, modelPubKeyHex, aesKey, modelId }

function toHex(bytes) {
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  return bytes;
}

// Generate ephemeral secp256k1 keypair
export function generateE2EESession() {
  const privateKey = utils.randomPrivateKey();
  const publicKey = getPublicKey(privateKey, false); // uncompressed = 65 bytes, starts with 04
  const pubKeyHex = toHex(publicKey);
  return { privateKey, publicKey, pubKeyHex };
}

// Fetch model's TEE attestation public key
export async function fetchModelPublicKey(modelId, apiKey) {
  const nonce = toHex(crypto.getRandomValues(new Uint8Array(32)));
  const url = `https://api.venice.ai/api/v1/tee/attestation?model=${encodeURIComponent(modelId)}&nonce=${nonce}`;
  const res = await fetch(url, { headers: { 'Authorization': `Bearer ${apiKey}` } });
  if (!res.ok) throw new Error(`TEE attestation failed (${res.status})`);
  const data = await res.json();
  // Venice returns the signing key as hex in the attestation response
  const pubKey = data.signing_public_key || data.signing_key || data.public_key;
  if (!pubKey) throw new Error('No public key in attestation response');
  return pubKey;
}

// ECDH + HKDF-SHA256 → AES-256-GCM key
export async function deriveAESKey(myPrivateKey, theirPublicKeyHex) {
  const sharedPoint = getSharedSecret(myPrivateKey, theirPublicKeyHex, false); // uncompressed
  const xCoord = sharedPoint.slice(1, 33); // 32-byte x-coordinate
  const hkdfKey = await crypto.subtle.importKey('raw', xCoord, 'HKDF', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: new TextEncoder().encode('ecdsa_encryption') },
    hkdfKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt plaintext → hex(pubKey65 + nonce12 + ciphertext)
export async function encryptMessage(aesKey, clientPubKeyBytes, plaintext) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, new TextEncoder().encode(plaintext));
  const out = new Uint8Array(65 + 12 + ct.byteLength);
  out.set(clientPubKeyBytes, 0);
  out.set(iv, 65);
  out.set(new Uint8Array(ct), 77);
  return toHex(out);
}

// Decrypt hex(serverEphemeralPubKey65 + nonce12 + ciphertext) → plaintext
// Each response chunk has its own server ephemeral key → per-chunk ECDH derivation
export async function decryptChunk(clientPrivateKey, hexString) {
  // Short or non-hex content is plaintext passthrough (e.g. whitespace tokens)
  if (!hexString || hexString.length < 154 || !/^[0-9a-f]+$/i.test(hexString)) return hexString;
  const raw = fromHex(hexString);
  const serverEphemeralPubKey = toHex(raw.slice(0, 65));
  const iv = raw.slice(65, 77);
  const ciphertext = raw.slice(77);
  const chunkKey = await deriveAESKey(clientPrivateKey, serverEphemeralPubKey);
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, chunkKey, ciphertext);
  return new TextDecoder().decode(pt);
}

// Get or create a session for the given E2EE model (30 min TTL)
const SESSION_TTL = 30 * 60 * 1000;
export async function getOrCreateE2EESession(modelId, apiKey) {
  if (_session && _session.modelId === modelId && Date.now() - _session.created < SESSION_TTL) return _session;
  const kp = generateE2EESession();
  const modelPubKeyHex = await fetchModelPublicKey(modelId, apiKey);
  const aesKey = await deriveAESKey(kp.privateKey, modelPubKeyHex);
  _session = { ...kp, modelPubKeyHex, aesKey, modelId, created: Date.now() };
  return _session;
}

export function clearE2EESession() { _session = null; }

export function isE2EEAvailable() { return typeof crypto !== 'undefined' && !!crypto.subtle; }

Object.assign(window, { clearE2EESession, isE2EEAvailable });
