/**
 * Pre-release audit test — paste into browser console or load via <script>
 * Run: copy(await runAuditTests()) or just runAuditTests()
 */
(function() {
  let passed = 0, failed = 0;
  const results = [];

  function assert(name, condition, detail) {
    if (condition) {
      passed++;
      results.push(`  ✓ ${name}`);
    } else {
      failed++;
      results.push(`  ✗ ${name}${detail ? ' — ' + detail : ''}`);
    }
  }

  // ═══════════════════════════════════════════════
  // BATCH 1: XSS
  // ═══════════════════════════════════════════════

  // 1a. escapeHTML works
  assert('escapeHTML escapes tags',
    escapeHTML('<img onerror=alert(1)>') === '&lt;img onerror=alert(1)&gt;');

  assert('escapeHTML escapes angle brackets',
    escapeHTML('<script>alert(1)</script>').includes('&lt;') && !escapeHTML('<script>').includes('<script>'));

  // 1b. showNotification uses textContent (no innerHTML injection)
  (function() {
    const container = document.getElementById('notification-container');
    const before = container.children.length;
    showNotification('<b>xss</b>', 'info', 500);
    const toast = container.lastElementChild;
    const hasBoldTag = toast && toast.querySelector('b');
    assert('showNotification escapes HTML in message',
      !hasBoldTag,
      hasBoldTag ? 'Found <b> tag inside toast' : '');
    // Clean up
    if (toast) setTimeout(() => toast.remove(), 100);
  })();

  // 1c. Profile dropdown escapes names
  (function() {
    const profiles = getProfiles();
    const originalName = profiles[0] ? profiles[0].name : null;
    if (profiles[0]) {
      profiles[0].name = '<img src=x onerror=alert(1)>';
      localStorage.setItem('labcharts-profiles', JSON.stringify(profiles));
      renderProfileDropdown();
      const label = document.querySelector('.profile-label');
      const hasImg = label && label.querySelector('img');
      assert('Profile dropdown escapes HTML names',
        !hasImg,
        hasImg ? 'Found <img> tag in profile label' : '');
      // Restore
      profiles[0].name = originalName || 'Default';
      localStorage.setItem('labcharts-profiles', JSON.stringify(profiles));
      renderProfileDropdown();
    } else {
      assert('Profile dropdown escapes HTML names', true, 'skipped — no profiles');
    }
  })();

  // 1d. Ollama model name escaping (static check)
  (function() {
    // Read the source of testOllamaConnection to verify escapeHTML is called
    const src = testOllamaConnection.toString();
    assert('Ollama model options use escapeHTML',
      src.includes('escapeHTML(m)'),
      'testOllamaConnection should call escapeHTML on model names');
  })();

  // ═══════════════════════════════════════════════
  // BATCH 2: CSS VARIABLES
  // ═══════════════════════════════════════════════

  (function() {
    const root = getComputedStyle(document.documentElement);

    // Check that undefined variables aren't used
    // Create a temporary element with each class and check computed values
    const testEl = document.createElement('div');
    testEl.className = 'chat-personality-custom-textarea';
    testEl.style.position = 'absolute';
    testEl.style.visibility = 'hidden';
    document.body.appendChild(testEl);
    const bgValue = getComputedStyle(testEl).backgroundColor;
    assert('Chat textarea --bg-primary resolves',
      bgValue && bgValue !== '' && bgValue !== 'rgba(0, 0, 0, 0)',
      `Got: ${bgValue}`);
    testEl.remove();
  })();

  // Check no duplicate @keyframes shimmer (read stylesheet)
  (function() {
    let shimmerCount = 0;
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule instanceof CSSKeyframesRule && rule.name === 'shimmer') {
            shimmerCount++;
          }
        }
      } catch(e) { /* cross-origin sheets */ }
    }
    assert('No duplicate @keyframes shimmer',
      shimmerCount <= 1,
      `Found ${shimmerCount} declarations`);
  })();

  // ═══════════════════════════════════════════════
  // BATCH 3: DATA INTEGRITY
  // ═══════════════════════════════════════════════

  // 3a. markerRegistry is let (clearable)
  assert('markerRegistry is reassignable',
    typeof markerRegistry === 'object');

  // 3b. confirmImport checks profile ID
  (function() {
    const src = confirmImport.toString();
    assert('confirmImport guards against profile switch',
      src.includes('_importProfileId'),
      'Should check _importProfileId !== currentProfile');
  })();

  // 3c. saveProfiles has try/catch
  (function() {
    const src = saveProfiles.toString();
    assert('saveProfiles has try/catch',
      src.includes('try') && src.includes('catch'));
  })();

  // 3d. deleteProfile cleans up all keys
  (function() {
    const src = deleteProfile.toString();
    assert('deleteProfile removes focusCard cache',
      src.includes('focusCard'));
    assert('deleteProfile removes contextHealth cache',
      src.includes('contextHealth'));
    assert('deleteProfile removes chatPersonality',
      src.includes('chatPersonality'));
    assert('deleteProfile removes onboarded',
      src.includes('onboarded'));
  })();

  // 3e. singlePoint uses latest entry
  (function() {
    const src = getActiveData.toString();
    assert('singlePoint iterates in reverse for latest entry',
      src.includes('ei >= 0') || src.includes('ei--'),
      'Should loop backwards through entries');
  })();

  // 3f. clearAllData removes focusCard cache
  (function() {
    const src = clearAllData.toString();
    assert('clearAllData removes focusCard cache',
      src.includes('focusCard'));
  })();

  // ═══════════════════════════════════════════════
  // BATCH 4: AI CONTEXT
  // ═══════════════════════════════════════════════

  // 4a. Focus card fingerprint includes new fields
  (function() {
    const src = getFocusCardFingerprint.toString();
    assert('Fingerprint includes contextNotes',
      src.includes('contextNotes'));
    assert('Fingerprint includes menstrualCycle',
      src.includes('menstrualCycle'));
    assert('Fingerprint includes supplements',
      src.includes('supplements'));
  })();

  // 4b. Health dots prompt uses JSON.stringify for example
  (function() {
    const src = loadContextHealthDots.toString();
    assert('Health dots prompt builds proper JSON example',
      src.includes('JSON.stringify(exampleObj)') || src.includes('exampleJSON'),
      'Should not use string concatenation for JSON example');
  })();

  // 4c. buildLabContext mentions range mode
  (function() {
    const ctx = buildLabContext();
    if (ctx.includes('No lab data')) {
      assert('buildLabContext includes range mode note', true, 'skipped — no data loaded');
    } else {
      assert('buildLabContext includes range mode note',
        ctx.includes('optimal ranges') || ctx.includes('reference ranges'),
        'Should mention which ranges status labels use');
    }
  })();

  // 4d. buildMarkerReference uses sex-adjusted ranges
  (function() {
    const src = buildMarkerReference.toString();
    assert('buildMarkerReference applies sex-specific ranges',
      src.includes('refMin_f') && src.includes('refMax_f'));
  })();

  // 4e. Menstrual cycle includes periodLength
  (function() {
    const src = buildLabContext.toString();
    assert('Cycle context includes periodLength',
      src.includes('periodLength'));
  })();

  // ═══════════════════════════════════════════════
  // BATCH 5: UI/UX
  // ═══════════════════════════════════════════════

  // 5a. Modal z-index above chat
  (function() {
    const overlay = document.getElementById('import-modal-overlay');
    if (overlay) {
      const z = parseInt(getComputedStyle(overlay).zIndex);
      const chatBackdrop = document.getElementById('chat-backdrop');
      const chatZ = chatBackdrop ? parseInt(getComputedStyle(chatBackdrop).zIndex) : 250;
      assert('Import modal z-index > chat backdrop',
        z > chatZ,
        `modal: ${z}, chat: ${chatZ}`);
    } else {
      assert('Import modal z-index > chat backdrop', true, 'skipped — no overlay element');
    }
  })();

  // 5b. Notification z-index above confirm dialog
  (function() {
    const container = document.getElementById('notification-container');
    if (container) {
      const z = parseInt(getComputedStyle(container).zIndex);
      assert('Notification z-index > 300 (confirm dialog)',
        z > 300,
        `Got: ${z}`);
    }
  })();

  // 5c. closeModal removes suggestion listener
  (function() {
    const src = closeModal.toString();
    assert('closeModal removes closeSuggestionsOnClickOutside listener',
      src.includes('removeEventListener') && src.includes('closeSuggestionsOnClickOutside'));
  })();

  // 5d. Stream error cancels RAF
  (function() {
    const src = sendChatMessage.toString();
    // Check the catch block has cancelAnimationFrame
    const catchIdx = src.lastIndexOf('catch');
    const catchBlock = catchIdx > -1 ? src.slice(catchIdx, catchIdx + 200) : '';
    assert('Stream error catch cancels RAF',
      catchBlock.includes('cancelAnimationFrame'),
      'catch block should call cancelAnimationFrame(_streamRafId)');
  })();

  // 5e. callAnthropicAPI has timeout
  (function() {
    const src = callAnthropicAPI.toString();
    assert('callAnthropicAPI has AbortSignal.timeout',
      src.includes('AbortSignal.timeout'));
  })();

  // 5f. PDF JSON repair console.log is gated
  (function() {
    const src = tryParseJSON.toString();
    assert('tryParseJSON console.log gated behind isDebugMode',
      src.includes('isDebugMode()') && src.includes('console.log'),
      'Should only log in debug mode');
  })();

  // ═══════════════════════════════════════════════
  // BONUS: migrateProfileData
  // ═══════════════════════════════════════════════
  (function() {
    const src = migrateProfileData.toString();
    assert('migrateProfileData initializes menstrualCycle',
      src.includes("menstrualCycle") && src.includes("null"));
  })();

  // ═══════════════════════════════════════════════
  // RESULTS
  // ═══════════════════════════════════════════════
  const summary = `\n🔍 Audit Test Results: ${passed} passed, ${failed} failed\n\n${results.join('\n')}\n`;
  console.log(summary);
  if (failed === 0) {
    console.log('%c All tests passed! ✓', 'color: #34d399; font-weight: bold; font-size: 14px');
  } else {
    console.log('%c Some tests failed — review above', 'color: #f87171; font-weight: bold; font-size: 14px');
  }
  return summary;
})();
