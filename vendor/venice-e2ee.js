// node_modules/@noble/secp256k1/index.js
var secp256k1_CURVE = {
  p: 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2fn,
  n: 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n,
  h: 1n,
  a: 0n,
  b: 7n,
  Gx: 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n,
  Gy: 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n
};
var { p: P, n: N, Gx, Gy, b: _b } = secp256k1_CURVE;
var L = 32;
var L2 = 64;
var err = (m = "") => {
  throw new Error(m);
};
var isBig = (n) => typeof n === "bigint";
var isStr = (s) => typeof s === "string";
var isBytes = (a) => a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
var abytes = (a, l) => !isBytes(a) || typeof l === "number" && l > 0 && a.length !== l ? err("Uint8Array expected") : a;
var u8n = (len) => new Uint8Array(len);
var u8fr = (buf) => Uint8Array.from(buf);
var padh = (n, pad) => n.toString(16).padStart(pad, "0");
var bytesToHex = (b) => Array.from(abytes(b)).map((e) => padh(e, 2)).join("");
var C = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
var _ch = (ch) => {
  if (ch >= C._0 && ch <= C._9)
    return ch - C._0;
  if (ch >= C.A && ch <= C.F)
    return ch - (C.A - 10);
  if (ch >= C.a && ch <= C.f)
    return ch - (C.a - 10);
  return;
};
var hexToBytes = (hex) => {
  const e = "hex invalid";
  if (!isStr(hex))
    return err(e);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    return err(e);
  const array = u8n(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = _ch(hex.charCodeAt(hi));
    const n2 = _ch(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0)
      return err(e);
    array[ai] = n1 * 16 + n2;
  }
  return array;
};
var toU8 = (a, len) => abytes(isStr(a) ? hexToBytes(a) : u8fr(abytes(a)), len);
var cr = () => globalThis?.crypto;
var concatBytes = (...arrs) => {
  const r = u8n(arrs.reduce((sum, a) => sum + abytes(a).length, 0));
  let pad = 0;
  arrs.forEach((a) => {
    r.set(a, pad);
    pad += a.length;
  });
  return r;
};
var randomBytes = (len = L) => {
  const c = cr();
  return c.getRandomValues(u8n(len));
};
var big = BigInt;
var arange = (n, min, max, msg = "bad number: out of range") => isBig(n) && min <= n && n < max ? n : err(msg);
var M = (a, b = P) => {
  const r = a % b;
  return r >= 0n ? r : b + r;
};
var invert = (num, md) => {
  if (num === 0n || md <= 0n)
    err("no inverse n=" + num + " mod=" + md);
  let a = M(num, md), b = md, x = 0n, y = 1n, u = 1n, v = 0n;
  while (a !== 0n) {
    const q = b / a, r = b % a;
    const m = x - u * q, n = y - v * q;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  return b === 1n ? M(x, md) : err("no inverse");
};
var apoint = (p) => p instanceof Point ? p : err("Point expected");
var koblitz = (x) => M(M(x * x) * x + _b);
var afield0 = (n) => arange(n, 0n, P);
var afield = (n) => arange(n, 1n, P);
var agroup = (n) => arange(n, 1n, N);
var isEven = (y) => (y & 1n) === 0n;
var u8of = (n) => Uint8Array.of(n);
var getPrefix = (y) => u8of(isEven(y) ? 2 : 3);
var lift_x = (x) => {
  const c = koblitz(afield(x));
  let r = 1n;
  for (let num = c, e = (P + 1n) / 4n; e > 0n; e >>= 1n) {
    if (e & 1n)
      r = r * num % P;
    num = num * num % P;
  }
  return M(r * r) === c ? r : err("sqrt invalid");
};
var Point = class _Point {
  static BASE;
  static ZERO;
  px;
  py;
  pz;
  constructor(px, py, pz) {
    this.px = afield0(px);
    this.py = afield(py);
    this.pz = afield0(pz);
    Object.freeze(this);
  }
  /** Convert Uint8Array or hex string to Point. */
  static fromBytes(bytes) {
    abytes(bytes);
    let p = void 0;
    const head = bytes[0];
    const tail = bytes.subarray(1);
    const x = sliceBytesNumBE(tail, 0, L);
    const len = bytes.length;
    if (len === L + 1 && [2, 3].includes(head)) {
      let y = lift_x(x);
      const evenY = isEven(y);
      const evenH = isEven(big(head));
      if (evenH !== evenY)
        y = M(-y);
      p = new _Point(x, y, 1n);
    }
    if (len === L2 + 1 && head === 4)
      p = new _Point(x, sliceBytesNumBE(tail, L, L2), 1n);
    return p ? p.assertValidity() : err("bad point: not on curve");
  }
  /** Equality check: compare points P&Q. */
  equals(other) {
    const { px: X1, py: Y1, pz: Z1 } = this;
    const { px: X2, py: Y2, pz: Z2 } = apoint(other);
    const X1Z2 = M(X1 * Z2);
    const X2Z1 = M(X2 * Z1);
    const Y1Z2 = M(Y1 * Z2);
    const Y2Z1 = M(Y2 * Z1);
    return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
  }
  is0() {
    return this.equals(I);
  }
  /** Flip point over y coordinate. */
  negate() {
    return new _Point(this.px, M(-this.py), this.pz);
  }
  /** Point doubling: P+P, complete formula. */
  double() {
    return this.add(this);
  }
  /**
   * Point addition: P+Q, complete, exception-free formula
   * (Renes-Costello-Batina, algo 1 of [2015/1060](https://eprint.iacr.org/2015/1060)).
   * Cost: `12M + 0S + 3*a + 3*b3 + 23add`.
   */
  // prettier-ignore
  add(other) {
    const { px: X1, py: Y1, pz: Z1 } = this;
    const { px: X2, py: Y2, pz: Z2 } = apoint(other);
    const a = 0n;
    const b = _b;
    let X3 = 0n, Y3 = 0n, Z3 = 0n;
    const b3 = M(b * 3n);
    let t0 = M(X1 * X2), t1 = M(Y1 * Y2), t2 = M(Z1 * Z2), t3 = M(X1 + Y1);
    let t4 = M(X2 + Y2);
    t3 = M(t3 * t4);
    t4 = M(t0 + t1);
    t3 = M(t3 - t4);
    t4 = M(X1 + Z1);
    let t5 = M(X2 + Z2);
    t4 = M(t4 * t5);
    t5 = M(t0 + t2);
    t4 = M(t4 - t5);
    t5 = M(Y1 + Z1);
    X3 = M(Y2 + Z2);
    t5 = M(t5 * X3);
    X3 = M(t1 + t2);
    t5 = M(t5 - X3);
    Z3 = M(a * t4);
    X3 = M(b3 * t2);
    Z3 = M(X3 + Z3);
    X3 = M(t1 - Z3);
    Z3 = M(t1 + Z3);
    Y3 = M(X3 * Z3);
    t1 = M(t0 + t0);
    t1 = M(t1 + t0);
    t2 = M(a * t2);
    t4 = M(b3 * t4);
    t1 = M(t1 + t2);
    t2 = M(t0 - t2);
    t2 = M(a * t2);
    t4 = M(t4 + t2);
    t0 = M(t1 * t4);
    Y3 = M(Y3 + t0);
    t0 = M(t5 * t4);
    X3 = M(t3 * X3);
    X3 = M(X3 - t0);
    t0 = M(t3 * t1);
    Z3 = M(t5 * Z3);
    Z3 = M(Z3 + t0);
    return new _Point(X3, Y3, Z3);
  }
  /**
   * Point-by-scalar multiplication. Scalar must be in range 1 <= n < CURVE.n.
   * Uses {@link wNAF} for base point.
   * Uses fake point to mitigate side-channel leakage.
   * @param n scalar by which point is multiplied
   * @param safe safe mode guards against timing attacks; unsafe mode is faster
   */
  multiply(n, safe = true) {
    if (!safe && n === 0n)
      return I;
    agroup(n);
    if (n === 1n)
      return this;
    if (this.equals(G))
      return wNAF(n).p;
    let p = I;
    let f = G;
    for (let d = this; n > 0n; d = d.double(), n >>= 1n) {
      if (n & 1n)
        p = p.add(d);
      else if (safe)
        f = f.add(d);
    }
    return p;
  }
  /** Convert point to 2d xy affine point. (X, Y, Z) ∋ (x=X/Z, y=Y/Z) */
  toAffine() {
    const { px: x, py: y, pz: z } = this;
    if (this.equals(I))
      return { x: 0n, y: 0n };
    if (z === 1n)
      return { x, y };
    const iz = invert(z, P);
    if (M(z * iz) !== 1n)
      err("inverse invalid");
    return { x: M(x * iz), y: M(y * iz) };
  }
  /** Checks if the point is valid and on-curve. */
  assertValidity() {
    const { x, y } = this.toAffine();
    afield(x);
    afield(y);
    return M(y * y) === koblitz(x) ? this : err("bad point: not on curve");
  }
  /** Converts point to 33/65-byte Uint8Array. */
  toBytes(isCompressed = true) {
    const { x, y } = this.assertValidity().toAffine();
    const x32b = numTo32b(x);
    if (isCompressed)
      return concatBytes(getPrefix(y), x32b);
    return concatBytes(u8of(4), x32b, numTo32b(y));
  }
  /** Create 3d xyz point from 2d xy. (0, 0) => (0, 1, 0), not (0, 0, 1) */
  static fromAffine(ap) {
    const { x, y } = ap;
    return x === 0n && y === 0n ? I : new _Point(x, y, 1n);
  }
  toHex(isCompressed) {
    return bytesToHex(this.toBytes(isCompressed));
  }
  static fromPrivateKey(k) {
    return G.multiply(toPrivScalar(k));
  }
  static fromHex(hex) {
    return _Point.fromBytes(toU8(hex));
  }
  get x() {
    return this.toAffine().x;
  }
  get y() {
    return this.toAffine().y;
  }
  toRawBytes(isCompressed) {
    return this.toBytes(isCompressed);
  }
};
var G = new Point(Gx, Gy, 1n);
var I = new Point(0n, 1n, 0n);
Point.BASE = G;
Point.ZERO = I;
var bytesToNumBE = (b) => big("0x" + (bytesToHex(b) || "0"));
var sliceBytesNumBE = (b, from, to) => bytesToNumBE(b.subarray(from, to));
var B256 = 2n ** 256n;
var numTo32b = (num) => hexToBytes(padh(arange(num, 0n, B256), L2));
var toPrivScalar = (pr) => {
  const num = isBig(pr) ? pr : bytesToNumBE(toU8(pr, L));
  return arange(num, 1n, N, "private key invalid 3");
};
var getPublicKey = (privKey, isCompressed = true) => {
  return G.multiply(toPrivScalar(privKey)).toBytes(isCompressed);
};
var getSharedSecret = (privA, pubB, isCompressed = true) => {
  return Point.fromBytes(toU8(pubB)).multiply(toPrivScalar(privA)).toBytes(isCompressed);
};
var hashToPrivateKey = (hash) => {
  hash = toU8(hash);
  if (hash.length < L + 8 || hash.length > 1024)
    err("expected 40-1024b");
  const num = M(bytesToNumBE(hash), N - 1n);
  return numTo32b(num + 1n);
};
var randomPrivateKey = () => hashToPrivateKey(randomBytes(L + 16));
var utils = {
  normPrivateKeyToScalar: toPrivScalar,
  isValidPrivateKey: (key) => {
    try {
      return !!toPrivScalar(key);
    } catch (e) {
      return false;
    }
  },
  randomPrivateKey,
  precompute: (w = 8, p = G) => {
    p.multiply(3n);
    w;
    return p;
  }
};
var W = 8;
var scalarBits = 256;
var pwindows = Math.ceil(scalarBits / W) + 1;
var pwindowSize = 2 ** (W - 1);
var precompute = () => {
  const points = [];
  let p = G;
  let b = p;
  for (let w = 0; w < pwindows; w++) {
    b = p;
    points.push(b);
    for (let i = 1; i < pwindowSize; i++) {
      b = b.add(p);
      points.push(b);
    }
    p = b.double();
  }
  return points;
};
var Gpows = void 0;
var ctneg = (cnd, p) => {
  const n = p.negate();
  return cnd ? n : p;
};
var wNAF = (n) => {
  const comp = Gpows || (Gpows = precompute());
  let p = I;
  let f = G;
  const pow_2_w = 2 ** W;
  const maxNum = pow_2_w;
  const mask = big(pow_2_w - 1);
  const shiftBy = big(W);
  for (let w = 0; w < pwindows; w++) {
    let wbits = Number(n & mask);
    n >>= shiftBy;
    if (wbits > pwindowSize) {
      wbits -= maxNum;
      n += 1n;
    }
    const off = w * pwindowSize;
    const offF = off;
    const offP = off + Math.abs(wbits) - 1;
    const isEven2 = w % 2 !== 0;
    const isNeg = wbits < 0;
    if (wbits === 0) {
      f = f.add(ctneg(isEven2, comp[offF]));
    } else {
      p = p.add(ctneg(isNeg, comp[offP]));
    }
  }
  return { p, f };
};

// src/crypto.ts
function toHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
function fromHex(hex) {
  if (hex.length % 2 !== 0) throw new Error("Invalid hex: odd length");
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}
function generateKeypair() {
  const privateKey = utils.randomPrivateKey();
  const publicKey = getPublicKey(privateKey, false);
  const pubKeyHex = toHex(publicKey);
  return { privateKey, publicKey, pubKeyHex };
}
async function deriveAESKey(myPrivateKey, theirPublicKeyHex) {
  const sharedPoint = getSharedSecret(myPrivateKey, theirPublicKeyHex, false);
  const xCoord = sharedPoint.slice(1, 33);
  const hkdfKey = await crypto.subtle.importKey(
    "raw",
    xCoord,
    "HKDF",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(0),
      info: new TextEncoder().encode("ecdsa_encryption")
    },
    hkdfKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}
async function encryptMessage(aesKey, clientPubKeyBytes, plaintext) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    new TextEncoder().encode(plaintext)
  );
  const out = new Uint8Array(65 + 12 + ct.byteLength);
  out.set(clientPubKeyBytes, 0);
  out.set(iv, 65);
  out.set(new Uint8Array(ct), 77);
  return toHex(out);
}
async function decryptChunk(clientPrivateKey, hexString) {
  if (!hexString || hexString.length < 154 || !/^[0-9a-f]+$/i.test(hexString)) {
    return hexString;
  }
  const raw = fromHex(hexString);
  const serverEphemeralPubKey = toHex(raw.slice(0, 65));
  const iv = raw.slice(65, 77);
  const ciphertext = raw.slice(77);
  const chunkKey = await deriveAESKey(clientPrivateKey, serverEphemeralPubKey);
  const pt = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    chunkKey,
    ciphertext
  );
  return new TextDecoder().decode(pt);
}

// src/stream.ts
async function* decryptSSEStream(body, privateKey) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") return;
        let event;
        try {
          event = JSON.parse(data);
        } catch {
          continue;
        }
        const content = event.choices?.[0]?.delta?.content;
        if (content === void 0 || content === null) continue;
        try {
          yield await decryptChunk(privateKey, content);
        } catch (e) {
          if (e instanceof DOMException && e.name === "OperationError") {
            throw new Error(
              "E2EE decryption failed \u2014 session may be stale. Clear the session and retry."
            );
          }
          throw e;
        }
      }
    }
    if (buffer.trim()) {
      if (buffer.startsWith("data: ")) {
        const data = buffer.slice(6).trim();
        if (data !== "[DONE]") {
          try {
            const event = JSON.parse(data);
            const content = event.choices?.[0]?.delta?.content;
            if (content !== void 0 && content !== null) {
              yield await decryptChunk(privateKey, content);
            }
          } catch {
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// src/index.ts
var DEFAULT_BASE_URL = "https://api.venice.ai";
var DEFAULT_SESSION_TTL = 30 * 60 * 1e3;
function createVeniceE2EE(options) {
  const {
    apiKey,
    baseUrl = DEFAULT_BASE_URL,
    sessionTTL = DEFAULT_SESSION_TTL
  } = options;
  let _session = null;
  async function fetchModelPublicKey(modelId) {
    const nonce = toHex(crypto.getRandomValues(new Uint8Array(32)));
    const url = `${baseUrl}/api/v1/tee/attestation?model=${encodeURIComponent(modelId)}&nonce=${nonce}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    if (!res.ok) throw new Error(`TEE attestation failed (${res.status})`);
    const data = await res.json();
    const pubKey = data.signing_public_key || data.signing_key || data.public_key;
    if (!pubKey) throw new Error("No public key in attestation response");
    return pubKey;
  }
  async function createSession(modelId) {
    if (_session && _session.modelId === modelId && Date.now() - _session.created < sessionTTL) {
      return _session;
    }
    const keypair = generateKeypair();
    const modelPubKeyHex = await fetchModelPublicKey(modelId);
    const aesKey = await deriveAESKey(keypair.privateKey, modelPubKeyHex);
    _session = {
      ...keypair,
      modelPubKeyHex,
      aesKey,
      modelId,
      created: Date.now()
    };
    return _session;
  }
  async function encrypt(messages, session) {
    const encryptedMessages = await Promise.all(
      messages.map(async (msg) => ({
        role: msg.role,
        content: await encryptMessage(
          session.aesKey,
          session.publicKey,
          msg.content
        )
      }))
    );
    return {
      encryptedMessages,
      headers: {
        "X-Venice-TEE-Client-Pub-Key": session.pubKeyHex,
        "X-Venice-TEE-Model-Pub-Key": session.modelPubKeyHex,
        "X-Venice-TEE-Signing-Algo": "ecdsa"
      },
      veniceParameters: { enable_e2ee: true }
    };
  }
  async function decrypt(hexChunk, session) {
    return decryptChunk(session.privateKey, hexChunk);
  }
  async function* decryptStream(body, session) {
    yield* decryptSSEStream(body, session.privateKey);
  }
  function clearSession() {
    if (_session) {
      _session.privateKey.fill(0);
      _session = null;
    }
  }
  return {
    createSession,
    encrypt,
    decryptChunk: decrypt,
    decryptStream,
    clearSession
  };
}
function isE2EEModel(modelId) {
  return modelId.startsWith("e2ee-");
}
export {
  createVeniceE2EE,
  decryptChunk,
  decryptSSEStream,
  deriveAESKey,
  encryptMessage,
  fromHex,
  generateKeypair,
  isE2EEModel,
  toHex
};
/*! Bundled license information:

@noble/secp256k1/index.js:
  (*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) *)
*/
