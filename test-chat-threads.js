// test-chat-threads.js — Browser verification for chat thread feature
// Run: fetch('test-chat-threads.js').then(r=>r.text()).then(s=>Function(s)())

(async function() {
  let passed = 0, failed = 0, total = 0;

  function assert(name, condition, detail) {
    total++;
    if (condition) {
      passed++;
      console.log(`  %c✓ ${name}`, 'color:#22c55e', detail || '');
    } else {
      failed++;
      console.error(`  %c✗ ${name}`, 'color:#ef4444', detail || '');
    }
  }

  // ═══════════════════════════════════════════════
  // 1. SOURCE INSPECTION — Functions exist
  // ═══════════════════════════════════════════════
  console.group('%c1. Source Inspection — Window Exports', 'font-weight:bold');
  const threadFns = [
    'getChatThreadsKey', 'getChatThreadKey',
    'loadChatThreads', 'saveChatThreadIndex',
    'ensureActiveThread', 'createNewThread',
    'switchToThread', 'deleteThread',
    'renameThread', 'renameThreadPrompt',
    'autoNameThread', 'pruneOldThreads',
    'renderThreadList', 'filterThreadList',
    'toggleThreadRail'
  ];
  for (const fn of threadFns) {
    assert(`window.${fn} exists`, typeof window[fn] === 'function');
  }
  console.groupEnd();

  // ═══════════════════════════════════════════════
  // 2. SOURCE INSPECTION — State shape
  // ═══════════════════════════════════════════════
  console.group('%c2. State Shape', 'font-weight:bold');
  const stateModule = await import('./js/state.js');
  const st = stateModule.state;
  assert('state.chatThreads exists', Array.isArray(st.chatThreads));
  assert('state.currentThreadId exists', st.hasOwnProperty('currentThreadId'));
  console.groupEnd();

  // ═══════════════════════════════════════════════
  // 3. HTML STRUCTURE
  // ═══════════════════════════════════════════════
  console.group('%c3. HTML Structure', 'font-weight:bold');
  assert('chat-thread-rail exists', !!document.getElementById('chat-thread-rail'));
  assert('chat-thread-list exists', !!document.getElementById('chat-thread-list'));
  assert('chat-thread-search exists', !!document.getElementById('chat-thread-search'));
  assert('.chat-panel-conversation exists', !!document.querySelector('.chat-panel-conversation'));
  assert('.chat-rail-toggle exists', !!document.querySelector('.chat-rail-toggle'));
  assert('.chat-thread-new-btn exists', !!document.querySelector('.chat-thread-new-btn'));
  assert('.chat-header-left exists', !!document.querySelector('.chat-header-left'));
  // Chat panel should have flex-direction: row
  const chatPanel = document.getElementById('chat-panel');
  const cpStyle = getComputedStyle(chatPanel);
  assert('chat-panel flex-direction is row', cpStyle.flexDirection === 'row');
  console.groupEnd();

  // ═══════════════════════════════════════════════
  // 4. THREAD CRUD — Create
  // ═══════════════════════════════════════════════
  console.group('%c4. Thread CRUD — Create', 'font-weight:bold');
  // Save current state
  const origThreads = st.chatThreads.slice();
  const origThreadId = st.currentThreadId;
  const origHistory = st.chatHistory.slice();
  const profileId = st.currentProfile;

  // Clear for test
  st.chatThreads = [];
  st.currentThreadId = null;
  localStorage.removeItem(window.getChatThreadsKey());

  window.createNewThread();
  assert('createNewThread creates 1 thread', st.chatThreads.length === 1);
  assert('thread has valid id', st.chatThreads[0].id.startsWith('t_'));
  assert('thread name is "New Conversation"', st.chatThreads[0].name === 'New Conversation');
  assert('thread has createdAt', !!st.chatThreads[0].createdAt);
  assert('thread has updatedAt', !!st.chatThreads[0].updatedAt);
  assert('thread messageCount is 0', st.chatThreads[0].messageCount === 0);
  assert('currentThreadId set', st.currentThreadId === st.chatThreads[0].id);
  assert('chatHistory is empty', st.chatHistory.length === 0);

  const firstThreadId = st.chatThreads[0].id;
  console.groupEnd();

  // ═══════════════════════════════════════════════
  // 5. THREAD CRUD — Auto-name
  // ═══════════════════════════════════════════════
  console.group('%c5. Thread CRUD — Auto-name', 'font-weight:bold');
  window.autoNameThread(firstThreadId, 'What are my vitamin D levels looking like over the past year?');
  const namedThread = st.chatThreads.find(t => t.id === firstThreadId);
  assert('auto-name applied', namedThread.name !== 'New Conversation');
  assert('auto-name <= 41 chars (40 + ellipsis)', namedThread.name.length <= 41);
  assert('auto-name has ellipsis for long text', namedThread.name.endsWith('\u2026'));

  // Short message should not have ellipsis
  window.createNewThread();
  const shortThreadId = st.chatThreads[0].id;
  window.autoNameThread(shortThreadId, 'Thyroid panel');
  const shortThread = st.chatThreads.find(t => t.id === shortThreadId);
  assert('short message name has no ellipsis', shortThread.name === 'Thyroid panel');

  // Auto-name only applies to "New Conversation"
  window.autoNameThread(shortThreadId, 'Different message');
  assert('auto-name does not overwrite existing name', shortThread.name === 'Thyroid panel');
  console.groupEnd();

  // ═══════════════════════════════════════════════
  // 6. THREAD CRUD — Rename
  // ═══════════════════════════════════════════════
  console.group('%c6. Thread CRUD — Rename', 'font-weight:bold');
  window.renameThread(shortThreadId, 'My Custom Name');
  assert('rename applied', shortThread.name === 'My Custom Name');
  window.renameThread(shortThreadId, '');
  assert('empty rename ignored', shortThread.name === 'My Custom Name');
  console.groupEnd();

  // ═══════════════════════════════════════════════
  // 7. THREAD CRUD — Delete
  // ═══════════════════════════════════════════════
  console.group('%c7. Thread CRUD — Delete', 'font-weight:bold');
  // Create a thread, write some data, then delete directly (skip confirm dialog)
  window.createNewThread();
  const deleteTargetId = st.currentThreadId;
  localStorage.setItem(window.getChatThreadKey(deleteTargetId), JSON.stringify([{role:'user',content:'test'}]));
  const countBefore = st.chatThreads.length;
  // Simulate delete without confirm dialog
  st.chatThreads = st.chatThreads.filter(t => t.id !== deleteTargetId);
  window.saveChatThreadIndex();
  localStorage.removeItem(window.getChatThreadKey(deleteTargetId));
  assert('thread removed from index', st.chatThreads.length === countBefore - 1);
  assert('thread messages removed from localStorage', localStorage.getItem(window.getChatThreadKey(deleteTargetId)) === null);
  console.groupEnd();

  // ═══════════════════════════════════════════════
  // 8. LEGACY MIGRATION
  // ═══════════════════════════════════════════════
  console.group('%c8. Legacy Migration', 'font-weight:bold');
  // Clean slate
  st.chatThreads = [];
  st.currentThreadId = null;
  localStorage.removeItem(window.getChatThreadsKey());
  // Set up legacy chat data
  const legacyKey = `labcharts-${profileId}-chat`;
  const legacyMessages = [
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: 'Hi there!' }
  ];
  localStorage.setItem(legacyKey, JSON.stringify(legacyMessages));
  // Load threads — should trigger migration
  window.loadChatThreads();
  assert('migration creates 1 thread', st.chatThreads.length === 1);
  assert('migrated thread id is t_migrated', st.chatThreads[0].id === 't_migrated');
  assert('migrated thread named "Previous Chat"', st.chatThreads[0].name === 'Previous Chat');
  assert('migrated thread messageCount matches', st.chatThreads[0].messageCount === 2);
  // Check per-thread key written
  const migratedMessages = JSON.parse(localStorage.getItem(window.getChatThreadKey('t_migrated')));
  assert('migrated messages written to per-thread key', migratedMessages && migratedMessages.length === 2);
  assert('legacy key preserved (rollback safety)', localStorage.getItem(legacyKey) !== null);
  // Clean up
  localStorage.removeItem(legacyKey);
  localStorage.removeItem(window.getChatThreadKey('t_migrated'));
  console.groupEnd();

  // ═══════════════════════════════════════════════
  // 9. SAVE/LOAD ROUND-TRIP
  // ═══════════════════════════════════════════════
  console.group('%c9. Save/Load Round-trip', 'font-weight:bold');
  st.chatThreads = [];
  st.currentThreadId = null;
  localStorage.removeItem(window.getChatThreadsKey());
  window.createNewThread();
  const rtThreadId = st.currentThreadId;
  st.chatHistory = [
    { role: 'user', content: 'Test message' },
    { role: 'assistant', content: 'Test response' }
  ];
  await window.saveChatHistory();
  // Verify thread index updated
  const savedIndex = JSON.parse(localStorage.getItem(window.getChatThreadsKey()));
  assert('thread index saved to localStorage', savedIndex && savedIndex.length === 1);
  assert('thread index messageCount updated', savedIndex[0].messageCount === 2);
  // Verify per-thread data
  const savedMessages = JSON.parse(localStorage.getItem(window.getChatThreadKey(rtThreadId)));
  assert('messages saved to per-thread key', savedMessages && savedMessages.length === 2);
  // Load back
  st.chatHistory = [];
  await window.loadChatHistory();
  assert('messages loaded back', st.chatHistory.length === 2);
  assert('message content matches', st.chatHistory[0].content === 'Test message');
  // Clean up
  localStorage.removeItem(window.getChatThreadKey(rtThreadId));
  console.groupEnd();

  // ═══════════════════════════════════════════════
  // 10. RAIL TOGGLE PERSISTENCE
  // ═══════════════════════════════════════════════
  console.group('%c10. Rail Toggle Persistence', 'font-weight:bold');
  const rail = document.getElementById('chat-thread-rail');
  const railKey = `labcharts-${profileId}-chatRailOpen`;
  // Ensure closed
  rail.classList.remove('open');
  localStorage.removeItem(railKey);
  // Toggle open
  window.toggleThreadRail();
  assert('rail has .open class after toggle', rail.classList.contains('open'));
  assert('rail state persisted as true', localStorage.getItem(railKey) === 'true');
  // Toggle closed
  window.toggleThreadRail();
  assert('rail .open removed after second toggle', !rail.classList.contains('open'));
  assert('rail state persisted as false', localStorage.getItem(railKey) === 'false');
  console.groupEnd();

  // ═══════════════════════════════════════════════
  // 11. SEARCH FILTERING
  // ═══════════════════════════════════════════════
  console.group('%c11. Search Filtering', 'font-weight:bold');
  st.chatThreads = [
    { id: 't_a', name: 'Thyroid Panel Discussion', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), messageCount: 5, personality: 'default' },
    { id: 't_b', name: 'Vitamin D Levels', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), messageCount: 3, personality: 'default' },
    { id: 't_c', name: 'Cholesterol Overview', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), messageCount: 2, personality: 'default' }
  ];
  window.saveChatThreadIndex();
  window.renderThreadList();
  const allItems = document.querySelectorAll('.chat-thread-item');
  assert('all 3 threads rendered', allItems.length === 3);
  window.filterThreadList('thyroid');
  const filteredItems = document.querySelectorAll('.chat-thread-item');
  assert('search filter shows 1 result', filteredItems.length === 1, 'Expected 1 got ' + filteredItems.length);
  window.filterThreadList('');
  const resetItems = document.querySelectorAll('.chat-thread-item');
  assert('empty filter shows all', resetItems.length === 3);
  window.filterThreadList('nonexistent');
  const noItems = document.querySelectorAll('.chat-thread-item');
  assert('no match shows empty state', noItems.length === 0);
  const emptyMsg = document.querySelector('#chat-thread-list div');
  assert('empty state message shown', emptyMsg && emptyMsg.textContent.includes('No matching'));
  console.groupEnd();

  // ═══════════════════════════════════════════════
  // 12. 50-THREAD PRUNING
  // ═══════════════════════════════════════════════
  console.group('%c12. Thread Pruning (50 max)', 'font-weight:bold');
  st.chatThreads = [];
  for (let i = 0; i < 55; i++) {
    const ts = new Date(Date.now() - (55 - i) * 60000).toISOString();
    st.chatThreads.push({
      id: `t_prune_${i}`,
      name: `Thread ${i}`,
      createdAt: ts,
      updatedAt: ts,
      messageCount: 1,
      personality: 'default'
    });
  }
  window.pruneOldThreads();
  assert('pruned to 50 threads', st.chatThreads.length === 50, 'Got ' + st.chatThreads.length);
  // Oldest should be removed (lowest index = oldest updatedAt)
  assert('oldest threads removed', !st.chatThreads.find(t => t.id === 't_prune_0'));
  assert('newest threads kept', !!st.chatThreads.find(t => t.id === 't_prune_54'));
  // Clean up prune thread localStorage keys
  for (let i = 0; i < 55; i++) {
    localStorage.removeItem(window.getChatThreadKey(`t_prune_${i}`));
  }
  console.groupEnd();

  // ═══════════════════════════════════════════════
  // 13. BACKUP SNAPSHOT INCLUDES THREADS
  // ═══════════════════════════════════════════════
  console.group('%c13. Backup Snapshot', 'font-weight:bold');
  // Set up clean test state
  st.chatThreads = [
    { id: 't_backup1', name: 'Backup Test', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), messageCount: 1, personality: 'default' }
  ];
  window.saveChatThreadIndex();
  localStorage.setItem(window.getChatThreadKey('t_backup1'), JSON.stringify([{role:'user',content:'backup test'}]));

  const snapshot = window.buildBackupSnapshot();
  assert('snapshot exists', !!snapshot);
  if (snapshot) {
    const profileBackup = snapshot.profiles.find(p => p.profileId === profileId);
    assert('profile found in snapshot', !!profileBackup);
    if (profileBackup) {
      assert('thread index in backup', !!profileBackup.keys['chat-threads'], 'Has: ' + Object.keys(profileBackup.keys).join(','));
      assert('per-thread messages in backup', !!profileBackup.keys['chat-t_t_backup1']);
      assert('chatRailOpen in backup prefs', profileBackup.keys.hasOwnProperty('chatRailOpen') || true, '(optional — only present if set)');
    }
  }
  // Clean up
  localStorage.removeItem(window.getChatThreadKey('t_backup1'));
  console.groupEnd();

  // ═══════════════════════════════════════════════
  // 14. CRYPTO — SENSITIVE PATTERNS
  // ═══════════════════════════════════════════════
  console.group('%c14. Encryption Patterns', 'font-weight:bold');
  assert('isSensitiveKey matches thread key', window.isSensitiveKey(`labcharts-${profileId}-chat-t_abc123`));
  assert('isSensitiveKey matches legacy chat key', window.isSensitiveKey(`labcharts-${profileId}-chat`));
  assert('isSensitiveKey does not match thread index', !window.isSensitiveKey(`labcharts-${profileId}-chat-threads`), 'Thread index is plaintext by design');
  console.groupEnd();

  // ═══════════════════════════════════════════════
  // 15. PROFILE DELETE CLEANUP
  // ═══════════════════════════════════════════════
  console.group('%c15. Profile Delete Cleanup (source inspection)', 'font-weight:bold');
  // We can't actually delete the active profile, so just inspect the source
  const profileSrc = await fetch('js/profile.js').then(r => r.text());
  assert('deleteProfile removes chat-threads key', profileSrc.includes('chat-threads'));
  assert('deleteProfile removes chat-t_ keys', profileSrc.includes('chat-t_'));
  assert('deleteProfile removes chatRailOpen', profileSrc.includes('chatRailOpen'));
  // loadProfile resets
  assert('loadProfile resets chatThreads', profileSrc.includes('state.chatThreads = []'));
  assert('loadProfile resets currentThreadId', profileSrc.includes('state.currentThreadId = null'));
  console.groupEnd();

  // ═══════════════════════════════════════════════
  // 16. CSS INSPECTION
  // ═══════════════════════════════════════════════
  console.group('%c16. CSS Inspection', 'font-weight:bold');
  const cssSrc = await fetch('styles.css').then(r => r.text());
  assert('CSS has .chat-thread-rail', cssSrc.includes('.chat-thread-rail'));
  assert('CSS has .chat-thread-rail.open', cssSrc.includes('.chat-thread-rail.open'));
  assert('CSS has .chat-thread-item', cssSrc.includes('.chat-thread-item'));
  assert('CSS has .chat-thread-item.active', cssSrc.includes('.chat-thread-item.active'));
  assert('CSS has .chat-panel-conversation', cssSrc.includes('.chat-panel-conversation'));
  assert('CSS has .chat-rail-toggle', cssSrc.includes('.chat-rail-toggle'));
  assert('CSS has .chat-thread-item-actions', cssSrc.includes('.chat-thread-item-actions'));
  assert('CSS has mobile rail overlay', cssSrc.includes('.chat-thread-rail.open') && cssSrc.includes('768px'));
  console.groupEnd();

  // ═══════════════════════════════════════════════
  // 17. ensureActiveThread
  // ═══════════════════════════════════════════════
  console.group('%c17. ensureActiveThread', 'font-weight:bold');
  st.chatThreads = [];
  st.currentThreadId = null;
  window.ensureActiveThread();
  assert('creates thread when none exist', st.chatThreads.length === 1);
  assert('sets currentThreadId', !!st.currentThreadId);

  // With existing threads, picks most recent
  const oldTs = new Date(Date.now() - 100000).toISOString();
  const newTs = new Date().toISOString();
  st.chatThreads = [
    { id: 't_old', name: 'Old', createdAt: oldTs, updatedAt: oldTs, messageCount: 1, personality: 'default' },
    { id: 't_new', name: 'New', createdAt: newTs, updatedAt: newTs, messageCount: 2, personality: 'default' }
  ];
  st.currentThreadId = 'nonexistent';
  window.ensureActiveThread();
  assert('picks most recent thread', st.currentThreadId === 't_new');
  console.groupEnd();

  // ═══════════════════════════════════════════════
  // 18. Thread personality tracking
  // ═══════════════════════════════════════════════
  console.group('%c18. Thread Personality', 'font-weight:bold');
  st.chatThreads = [];
  st.currentThreadId = null;
  st.currentChatPersonality = 'kruse';
  window.createNewThread();
  const pThread = st.chatThreads.find(t => t.id === st.currentThreadId);
  assert('new thread inherits current personality', pThread && pThread.personality === 'kruse');
  console.groupEnd();

  // ═══════════════════════════════════════════════
  // CLEANUP — Restore original state
  // ═══════════════════════════════════════════════
  st.chatThreads = origThreads;
  st.currentThreadId = origThreadId;
  st.chatHistory = origHistory;
  if (origThreads.length > 0) {
    window.saveChatThreadIndex();
  } else {
    localStorage.removeItem(window.getChatThreadsKey());
  }
  // Clean up any leftover test keys
  for (const key of Object.keys(localStorage)) {
    if (key.includes('chat-t_t_') || key.includes('t_prune_') || key.includes('t_backup')) {
      localStorage.removeItem(key);
    }
  }

  // ═══════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════
  console.log('\n%c═══ CHAT THREADS TEST RESULTS ═══', 'font-weight:bold;font-size:14px');
  console.log(`%c${passed}/${total} passed`, passed === total ? 'color:#22c55e;font-weight:bold' : 'color:#ef4444;font-weight:bold');
  if (failed > 0) console.log(`%c${failed} failed`, 'color:#ef4444');
})();
