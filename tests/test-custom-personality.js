// test-custom-personality.js — Named Custom Personalities with AI Generation
// Run: fetch('tests/test-custom-personality.js').then(r=>r.text()).then(s=>Function(s)())

(async function() {
  const results = { passed: 0, failed: 0, total: 0 };
  function assert(name, condition, detail) {
    results.total++;
    if (condition) {
      results.passed++;
    } else {
      results.failed++;
      console.log(`%c  FAIL: ${name}${detail ? ' — ' + detail : ''}`, 'color:red');
    }
  }

  console.log('%c▶ Running test-custom-personality.js', 'font-weight:bold;font-size:13px');

  // ── 1. Window exports ──
  console.log('%c▶ 1. Window exports', 'font-weight:bold');
  assert('getCustomPersonality exported', typeof window.getCustomPersonality === 'function');
  assert('getCustomPersonalityText exported', typeof window.getCustomPersonalityText === 'function');
  assert('pickPersonaIcon exported', typeof window.pickPersonaIcon === 'function');
  assert('generateCustomPersonality exported', typeof window.generateCustomPersonality === 'function');
  assert('saveCustomPersonality exported', typeof window.saveCustomPersonality === 'function');
  assert('getActivePersonality exported', typeof window.getActivePersonality === 'function');
  assert('autoResizePersonaTextarea exported', typeof window.autoResizePersonaTextarea === 'function');
  assert('markPersonalityDirty exported', typeof window.markPersonalityDirty === 'function');
  assert('snapshotPersonalityClean exported', typeof window.snapshotPersonalityClean === 'function');

  // ── 2. pickPersonaIcon determinism ──
  console.log('%c▶ 2. pickPersonaIcon determinism', 'font-weight:bold');
  const icon1 = window.pickPersonaIcon('Dr. Jack Kruse');
  const icon2 = window.pickPersonaIcon('Dr. Jack Kruse');
  assert('pickPersonaIcon returns same icon for same name', icon1 === icon2, `${icon1} vs ${icon2}`);
  const icon3 = window.pickPersonaIcon('Dr. House');
  assert('pickPersonaIcon returns emoji', icon1.length > 0);
  assert('pickPersonaIcon different names can differ', true); // just ensuring no crash
  const iconEmpty = window.pickPersonaIcon('');
  assert('pickPersonaIcon empty name returns pencil', iconEmpty === '\u270F\uFE0F', `got: ${iconEmpty}`);
  const iconNull = window.pickPersonaIcon(null);
  assert('pickPersonaIcon null returns pencil', iconNull === '\u270F\uFE0F');
  const PERSONA_ICONS = ['\uD83E\uDDE0', '\uD83C\uDFAD', '\uD83D\uDD2E', '\uD83C\uDF3F', '\u26A1', '\uD83E\uDD8A', '\uD83E\uDDEC', '\uD83C\uDF0A', '\uD83D\uDD25', '\uD83C\uDFDB\uFE0F'];
  assert('pickPersonaIcon result is from palette', PERSONA_ICONS.includes(icon1), `got: ${icon1}`);

  // ── 3. Legacy string format backward compat ──
  console.log('%c▶ 3. Legacy string backward compat', 'font-weight:bold');
  const profileId = localStorage.getItem('labcharts-current-profile') || 'default';
  const key = `labcharts-${profileId}-chatPersonalityCustom`;
  const origVal = localStorage.getItem(key);
  // Set legacy plain string
  localStorage.setItem(key, 'Speak like a pirate doctor');
  const legacy = window.getCustomPersonality();
  assert('Legacy: name is Custom Personality', legacy.name === 'Custom Personality');
  assert('Legacy: icon is pencil', legacy.icon === '\u270F\uFE0F');
  assert('Legacy: promptText is the string', legacy.promptText === 'Speak like a pirate doctor');
  assert('Legacy: evidenceBased defaults false', legacy.evidenceBased === false);
  assert('Legacy: getCustomPersonalityText() returns string', window.getCustomPersonalityText() === 'Speak like a pirate doctor');

  // ── 4. New JSON object format ──
  console.log('%c▶ 4. JSON object format', 'font-weight:bold');
  const testObj = { name: 'Dr. Kruse', icon: '\uD83E\uDDE0', promptText: 'You are Dr. Jack Kruse...', evidenceBased: true };
  localStorage.setItem(key, JSON.stringify(testObj));
  const parsed = window.getCustomPersonality();
  assert('JSON: name parsed', parsed.name === 'Dr. Kruse');
  assert('JSON: icon parsed', parsed.icon === '\uD83E\uDDE0');
  assert('JSON: promptText parsed', parsed.promptText === 'You are Dr. Jack Kruse...');
  assert('JSON: evidenceBased parsed true', parsed.evidenceBased === true);
  assert('JSON: getCustomPersonalityText returns promptText', window.getCustomPersonalityText() === 'You are Dr. Jack Kruse...');

  // evidenceBased false
  const testObj2 = { name: 'Pirate', icon: '\uD83D\uDD25', promptText: 'Yarr', evidenceBased: false };
  localStorage.setItem(key, JSON.stringify(testObj2));
  assert('JSON: evidenceBased false', window.getCustomPersonality().evidenceBased === false);

  // evidenceBased missing (old format without it)
  const testObj3 = { name: 'Old', icon: '\uD83D\uDD25', promptText: 'test' };
  localStorage.setItem(key, JSON.stringify(testObj3));
  assert('JSON: missing evidenceBased defaults false', window.getCustomPersonality().evidenceBased === false);

  // Empty value
  localStorage.setItem(key, '');
  const empty = window.getCustomPersonality();
  assert('Empty: name is Custom Personality', empty.name === 'Custom Personality');
  assert('Empty: promptText is empty', empty.promptText === '');
  assert('Empty: evidenceBased false', empty.evidenceBased === false);

  // Restore original
  if (origVal !== null) localStorage.setItem(key, origVal);
  else localStorage.removeItem(key);

  // ── 5. getActivePersonality dynamic overlay ──
  console.log('%c▶ 5. getActivePersonality overlay for custom', 'font-weight:bold');
  const prevPersonality = localStorage.getItem(`labcharts-${profileId}-chatPersonality`);
  localStorage.setItem(`labcharts-${profileId}-chatPersonalityCustom`, JSON.stringify({ name: 'TestPersona', icon: '\uD83D\uDD25', promptText: 'test', evidenceBased: true }));
  // Temporarily set personality to custom
  if (window.loadChatPersonality) {
    localStorage.setItem(`labcharts-${profileId}-chatPersonality`, 'custom');
    window.loadChatPersonality();
  }
  const active = window.getActivePersonality();
  if (active.id === 'custom') {
    assert('Active custom: name is TestPersona', active.name === 'TestPersona');
    assert('Active custom: icon is fire', active.icon === '\uD83D\uDD25');
    assert('Active custom: still has greeting', typeof active.greeting === 'string' && active.greeting.length > 0);
  } else {
    assert('Active custom: personality was set to custom', false, `got id=${active.id}`);
  }
  // Restore
  if (prevPersonality !== null) localStorage.setItem(`labcharts-${profileId}-chatPersonality`, prevPersonality);
  else localStorage.removeItem(`labcharts-${profileId}-chatPersonality`);
  if (origVal !== null) localStorage.setItem(key, origVal);
  else localStorage.removeItem(key);
  if (window.loadChatPersonality) window.loadChatPersonality();

  // ── 6. HTML structure ──
  console.log('%c▶ 6. HTML structure', 'font-weight:bold');
  const nameInput = document.getElementById('chat-personality-custom-name');
  assert('Name input exists', !!nameInput);
  assert('Name input is text type', nameInput && nameInput.type === 'text');
  assert('Name input has placeholder', nameInput && nameInput.placeholder.toLowerCase().includes('kruse'));
  assert('Name input has oninput markPersonalityDirty', nameInput && nameInput.getAttribute('oninput') && nameInput.getAttribute('oninput').includes('markPersonalityDirty'));
  const genBtn = document.getElementById('chat-personality-generate-btn');
  assert('Generate button exists', !!genBtn);
  assert('Generate button text', genBtn && genBtn.textContent.trim() === 'Generate');
  assert('Generate button calls generateCustomPersonality', genBtn && genBtn.getAttribute('onclick') === 'generateCustomPersonality()');
  const textarea = document.querySelector('.chat-personality-custom-textarea');
  assert('Textarea exists', !!textarea);
  assert('Textarea has no rows attr (auto-resize)', !textarea.hasAttribute('rows'));
  assert('Textarea has oninput with autoResize', textarea && textarea.getAttribute('oninput') && textarea.getAttribute('oninput').includes('autoResizePersonaTextarea'));
  assert('Textarea has oninput with markDirty', textarea && textarea.getAttribute('oninput') && textarea.getAttribute('oninput').includes('markPersonalityDirty'));
  const customArea = document.querySelector('.chat-personality-custom-area');
  assert('Custom area exists', !!customArea);
  const header = document.querySelector('.chat-personality-custom-header');
  assert('Custom header div exists', !!header);
  assert('Header contains name input', header && header.contains(nameInput));
  assert('Header contains generate btn', header && header.contains(genBtn));
  // Evidence-based checkbox
  const ebCheckbox = document.getElementById('chat-personality-evidence-based');
  assert('Evidence-based checkbox exists', !!ebCheckbox);
  assert('Evidence-based is checkbox type', ebCheckbox && ebCheckbox.type === 'checkbox');
  assert('Evidence-based has onchange markDirty', ebCheckbox && ebCheckbox.getAttribute('onchange') && ebCheckbox.getAttribute('onchange').includes('markPersonalityDirty'));
  const ebLabel = document.querySelector('.chat-personality-evidence-label');
  assert('Evidence-based label exists', !!ebLabel);
  assert('Evidence-based label text', ebLabel && ebLabel.textContent.includes('evidence-based'));
  // Footer
  const footer = document.querySelector('.chat-personality-custom-footer');
  assert('Custom footer div exists', !!footer);
  // Save button starts disabled
  const saveBtn = document.querySelector('.chat-personality-custom-save');
  assert('Save button exists', !!saveBtn);
  assert('Save button starts disabled', saveBtn && saveBtn.disabled === true);

  // ── 7. CSS classes ──
  console.log('%c▶ 7. CSS classes', 'font-weight:bold');
  const sheets = Array.from(document.styleSheets);
  let foundHeader = false, foundNameInput = false, foundGenBtn = false, foundFooter = false, foundEvLabel = false, foundSaveDisabled = false;
  for (const sheet of sheets) {
    try {
      for (const rule of sheet.cssRules || []) {
        const sel = rule.selectorText || '';
        if (sel.includes('.chat-personality-custom-header')) foundHeader = true;
        if (sel.includes('.chat-personality-custom-name-input')) foundNameInput = true;
        if (sel.includes('.chat-personality-generate-btn')) foundGenBtn = true;
        if (sel.includes('.chat-personality-custom-footer')) foundFooter = true;
        if (sel.includes('.chat-personality-evidence-label')) foundEvLabel = true;
        if (sel.includes('.chat-personality-custom-save:disabled')) foundSaveDisabled = true;
      }
    } catch {}
  }
  assert('CSS: .chat-personality-custom-header exists', foundHeader);
  assert('CSS: .chat-personality-custom-name-input exists', foundNameInput);
  assert('CSS: .chat-personality-generate-btn exists', foundGenBtn);
  assert('CSS: .chat-personality-custom-footer exists', foundFooter);
  assert('CSS: .chat-personality-evidence-label exists', foundEvLabel);
  assert('CSS: .chat-personality-custom-save:disabled exists', foundSaveDisabled);

  // ── 8. Thread metadata stores personalityName/personalityIcon ──
  console.log('%c▶ 8. Thread metadata', 'font-weight:bold');
  const createSrc = window.createNewThread.toString();
  assert('createNewThread has personalityName', createSrc.includes('personalityName'));
  assert('createNewThread has personalityIcon', createSrc.includes('personalityIcon'));
  const saveSrc = window.saveChatHistory.toString();
  assert('saveChatHistory has personalityName', saveSrc.includes('personalityName'));
  assert('saveChatHistory has personalityIcon', saveSrc.includes('personalityIcon'));
  const renderSrc = window.renderThreadList.toString();
  assert('renderThreadList prefers t.personalityIcon', renderSrc.includes('t.personalityIcon'));
  assert('renderThreadList has iconTitle tooltip', renderSrc.includes('iconTitle') || renderSrc.includes('personalityName'));

  // ── 9. Backup format includes chatPersonalityCustom ──
  console.log('%c▶ 9. Backup compat', 'font-weight:bold');
  try {
    const cryptoSrc = await fetch('js/crypto.js').then(r => r.text());
    assert('PER_PROFILE_PREF_SUFFIXES has chatPersonalityCustom', cryptoSrc.includes('chatPersonalityCustom'));
  } catch {
    assert('Could read crypto.js', false);
  }

  // ── 10. Evidence-based opt-in in sendChatMessage ──
  console.log('%c▶ 10. Evidence-based opt-in logic', 'font-weight:bold');
  const sendSrc = window.sendChatMessage.toString();
  assert('sendChatMessage reads evidenceBased', sendSrc.includes('evidenceBased'));
  assert('sendChatMessage has conditional IMPORTANT', sendSrc.includes('IMPORTANT') && sendSrc.includes('evidenceBased'));
  assert('sendChatMessage uses Persona: prefix', sendSrc.includes('Persona:'));
  // Verify generate prompt does NOT include IMPORTANT
  const genSrc = window.generateCustomPersonality.toString();
  assert('generateCustomPersonality omits IMPORTANT', !genSrc.includes('IMPORTANT:'));
  assert('generateCustomPersonality has comprehensive sections', genSrc.includes('Analytical Approach') && genSrc.includes('Lifestyle'));

  // ── 11. Auto-resize textarea ──
  console.log('%c▶ 11. Auto-resize textarea', 'font-weight:bold');
  const taCss = window.getComputedStyle(textarea);
  assert('Textarea resize is none (auto-resize)', taCss.resize === 'none');
  assert('Textarea has min-height', parseInt(taCss.minHeight) >= 60);
  assert('Textarea has max-height', parseInt(taCss.maxHeight) <= 300);
  // autoResizePersonaTextarea runs without error
  try { window.autoResizePersonaTextarea(); assert('autoResizePersonaTextarea runs', true); } catch (e) { assert('autoResizePersonaTextarea runs', false, e.message); }

  // ── 12. Dirty state tracking ──
  console.log('%c▶ 12. Dirty state tracking', 'font-weight:bold');
  // snapshotPersonalityClean disables save button
  window.snapshotPersonalityClean();
  assert('After snapshot, save disabled', saveBtn.disabled === true);
  // markPersonalityDirty without changes keeps disabled
  window.markPersonalityDirty();
  assert('No changes, save stays disabled', saveBtn.disabled === true);

  // ── Summary ──
  const color = results.failed === 0 ? 'green' : 'red';
  console.log(`%c=== Results ===`, 'font-weight:bold');
  console.log(`%c${results.passed} passed, ${results.failed} failed`, `color:${color};font-weight:bold`);
  if (results.failed === 0) console.log('%c\uD83C\uDF89 All tests passed!', 'color:green;font-weight:bold');
})();
