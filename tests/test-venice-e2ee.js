// test-venice-e2ee.js — Venice E2EE crypto and integration tests
(async function() {
  let pass = 0, fail = 0;
  const results = [];
  function assert(name, condition, detail) {
    if (condition) { pass++; results.push('\u2705 ' + name); }
    else { fail++; results.push('\u274C ' + name + (detail ? ' — ' + detail : '')); }
  }

  // 1. Source: api.js has isE2EEModel and E2EE branch
  const apiSrc = await fetch('/js/api.js').then(r => r.text());
  assert('isE2EEModel exported in api.js', apiSrc.includes('export function isE2EEModel('));
  assert('e2ee prefix detection', apiSrc.includes("modelId.startsWith('e2ee-')"));
  assert('callVeniceAPI has E2EE import', apiSrc.includes("import('../vendor/venice-e2ee.js')"));
  assert('supportsWebSearch excludes E2EE', apiSrc.includes('isE2EEModel(getVeniceModel())'));
  assert('supportsVision excludes E2EE', apiSrc.includes('isE2EEModel(getVeniceModel())') && apiSrc.includes('return false'));
  assert('fetchVeniceModels preserves e2ee- prefix', apiSrc.includes("id.startsWith('e2ee-')"));

  // 2. window.isE2EEModel function
  assert('window.isE2EEModel is function', typeof window.isE2EEModel === 'function');
  assert('e2ee-llama-3.3-70b is E2EE', window.isE2EEModel('e2ee-llama-3.3-70b'));
  assert('llama-3.3-70b is not E2EE', !window.isE2EEModel('llama-3.3-70b'));
  assert('empty string is not E2EE', !window.isE2EEModel(''));
  assert('null is not E2EE', !window.isE2EEModel(null));
  assert('undefined is not E2EE', !window.isE2EEModel(undefined));

  // 3. venice-e2ee.js module loads and exports
  const e2eeMod = await import('/vendor/venice-e2ee.js');
  assert('createVeniceE2EE exported', typeof e2eeMod.createVeniceE2EE === 'function');
  assert('generateKeypair exported', typeof e2eeMod.generateKeypair === 'function');
  assert('deriveAESKey exported', typeof e2eeMod.deriveAESKey === 'function');
  assert('encryptMessage exported', typeof e2eeMod.encryptMessage === 'function');
  assert('decryptChunk exported', typeof e2eeMod.decryptChunk === 'function');
  assert('decryptSSEStream exported', typeof e2eeMod.decryptSSEStream === 'function');
  assert('verifyAttestation exported', typeof e2eeMod.verifyAttestation === 'function');
  assert('isE2EEModel exported', typeof e2eeMod.isE2EEModel === 'function');
  assert('toHex exported', typeof e2eeMod.toHex === 'function');
  assert('fromHex exported', typeof e2eeMod.fromHex === 'function');

  // 4. noble-secp256k1 is bundled inside venice-e2ee.js (generateKeypair uses it)
  assert('generateKeypair works (noble bundled)', typeof e2eeMod.generateKeypair() === 'object');

  // 5. Keypair generation
  const keypair = e2eeMod.generateKeypair();
  assert('keypair: privateKey is Uint8Array(32)', keypair.privateKey instanceof Uint8Array && keypair.privateKey.length === 32);
  assert('keypair: publicKey is Uint8Array(65)', keypair.publicKey instanceof Uint8Array && keypair.publicKey.length === 65);
  assert('keypair: pubKeyHex is 130 chars', keypair.pubKeyHex.length === 130);
  assert('keypair: pubKeyHex starts with 04', keypair.pubKeyHex.startsWith('04'));
  assert('keypair: pubKeyHex is lowercase hex', /^[0-9a-f]+$/.test(keypair.pubKeyHex));

  // 6. ECDH + AES key derivation (self-ECDH for testing)
  try {
    const aesKey = await e2eeMod.deriveAESKey(keypair.privateKey, keypair.pubKeyHex);
    assert('AES key derived', aesKey instanceof CryptoKey);

    // 7. Encrypt/decrypt round-trip
    const plaintext = 'What are my omega-3 levels?';
    const encrypted = await e2eeMod.encryptMessage(aesKey, keypair.publicKey, plaintext);
    assert('encrypted is hex string', typeof encrypted === 'string' && /^[0-9a-f]+$/.test(encrypted));
    assert('encrypted length > 154', encrypted.length > 154); // 65+12+min_ct = 77 bytes minimum = 154 hex chars
    assert('encrypted starts with pubkey', encrypted.startsWith(keypair.pubKeyHex));

    const decrypted = await e2eeMod.decryptChunk(keypair.privateKey, encrypted);
    assert('round-trip decryption matches', decrypted === plaintext);

    // 8. Different plaintexts produce different ciphertexts
    const enc2 = await e2eeMod.encryptMessage(aesKey, keypair.publicKey, plaintext);
    assert('different nonces produce different ciphertexts', enc2 !== encrypted);
    const dec2 = await e2eeMod.decryptChunk(keypair.privateKey, enc2);
    assert('second ciphertext also decrypts correctly', dec2 === plaintext);

    // 9. Empty string
    const encEmpty = await e2eeMod.encryptMessage(aesKey, keypair.publicKey, '');
    const decEmpty = await e2eeMod.decryptChunk(keypair.privateKey, encEmpty);
    assert('empty string round-trip', decEmpty === '');

    // 10. Unicode
    const unicodeText = 'Vitamin D \u2600\uFE0F level: 85 nmol/L \u2014 \u010Desk\u00FD text';
    const encUni = await e2eeMod.encryptMessage(aesKey, keypair.publicKey, unicodeText);
    const decUni = await e2eeMod.decryptChunk(keypair.privateKey, encUni);
    assert('unicode round-trip', decUni === unicodeText);
  } catch (e) {
    assert('crypto operations threw no error', false, e.message);
  }

  // 11. decryptChunk passthrough for non-hex content
  const pt1 = await e2eeMod.decryptChunk(keypair.privateKey, 'hello');
  assert('short non-hex passes through', pt1 === 'hello');
  const pt2 = await e2eeMod.decryptChunk(keypair.privateKey, '');
  assert('empty string passes through', pt2 === '');
  const pt3 = await e2eeMod.decryptChunk(keypair.privateKey, null);
  assert('null passes through', pt3 === null);

  // 12. createVeniceE2EE factory
  const instance = e2eeMod.createVeniceE2EE({ apiKey: 'test-key', verifyAttestation: false });
  assert('factory returns createSession', typeof instance.createSession === 'function');
  assert('factory returns encrypt', typeof instance.encrypt === 'function');
  assert('factory returns decryptChunk', typeof instance.decryptChunk === 'function');
  assert('factory returns decryptStream', typeof instance.decryptStream === 'function');
  assert('factory returns clearSession', typeof instance.clearSession === 'function');
  instance.clearSession();
  assert('clearSession runs without error', true);

  // 13. E2EE toggle + model-driven state
  assert('window.setVeniceE2EE is function', typeof window.setVeniceE2EE === 'function');
  assert('window.getVeniceE2EE is function', typeof window.getVeniceE2EE === 'function');
  assert('window.isVeniceE2EEActive is function', typeof window.isVeniceE2EEActive === 'function');
  const savedE2EE = localStorage.getItem('labcharts-venice-e2ee');
  const savedModel = localStorage.getItem('labcharts-venice-model');
  window.setVeniceE2EE(true);
  assert('setVeniceE2EE(true) persists', window.getVeniceE2EE() === true);
  window.setVeniceModel('e2ee-qwen3-30b-a3b-p');
  assert('isVeniceE2EEActive true with e2ee model', window.isVeniceE2EEActive());
  window.setVeniceModel('llama-3.3-70b');
  assert('isVeniceE2EEActive false with regular model', !window.isVeniceE2EEActive());
  window.setVeniceE2EE(false);
  assert('setVeniceE2EE(false) persists', window.getVeniceE2EE() === false);
  if (savedModel) localStorage.setItem('labcharts-venice-model', savedModel);
  if (savedE2EE) localStorage.setItem('labcharts-venice-e2ee', savedE2EE);
  else localStorage.removeItem('labcharts-venice-e2ee');

  // 14. supportsWebSearch respects E2EE model
  const savedProvider = localStorage.getItem('labcharts-ai-provider');
  window.setAIProvider('venice');
  window.setVeniceModel('e2ee-qwen3-30b-a3b-p');
  assert('supportsWebSearch false with E2EE model', !window.supportsWebSearch());
  window.setVeniceModel('llama-3.3-70b');
  assert('supportsWebSearch true with regular model', window.supportsWebSearch());
  if (savedModel) localStorage.setItem('labcharts-venice-model', savedModel);
  if (savedProvider) window.setAIProvider(savedProvider);
  else localStorage.removeItem('labcharts-ai-provider');

  // 15. Settings + Chat source checks
  const settingsSrc = await fetch('/js/settings.js').then(r => r.text());
  assert('settings has venice-e2ee-toggle', settingsSrc.includes('venice-e2ee-toggle'));
  assert('settings has venice-e2ee-indicator', settingsSrc.includes('venice-e2ee-indicator'));
  assert('settings has toggleVeniceE2EE', settingsSrc.includes('toggleVeniceE2EE'));
  const chatSrc = await fetch('/js/chat.js').then(r => r.text());
  assert('chat uses isVeniceE2EEActive', chatSrc.includes('isVeniceE2EEActive'));
  assert('chat shows lock emoji for E2EE', chatSrc.includes('\\uD83D\\uDD12'));
  assert('chat exports refreshWebSearchToggle', chatSrc.includes('refreshWebSearchToggle'));

  // Summary
  console.log(results.join('\n'));
  console.log(`=== Results ===\n${pass} passed, ${fail} failed`);
  if (fail > 0) console.log('\u274C FAILURES DETECTED');
  else console.log('\uD83C\uDF89 All tests passed!');
})();
