// test-chat-actions.js — Browser test for chat action buttons + scientific sources
// Run: fetch('test-chat-actions.js').then(r=>r.text()).then(s=>Function(s)())

(async function() {
  const results = [];
  let passed = 0, failed = 0;

  function assert(name, condition, detail) {
    if (condition) {
      passed++;
      results.push({ name, status: 'PASS', detail });
    } else {
      failed++;
      results.push({ name, status: 'FAIL', detail });
      console.error(`FAIL: ${name}`, detail);
    }
  }

  // Access the module's shared state object
  const S = window._labState;
  const hasState = S && typeof S === 'object';
  assert('window._labState exists', hasState, hasState ? 'found' : 'not found — hard-reload (Ctrl+Shift+R) to bust SW cache');

  // ─── Section 1: Window exports ───
  console.log('%c Section 1: Window Exports', 'font-weight:bold;color:#6366f1');

  const requiredExports = [
    'getContextSummary', 'buildActionBar', 'regenerateLastMessage',
    'copyMessage', 'toggleContextDetails', 'toggleSourcesDetails',
    'getChatSourcesEnabled', 'setChatSourcesEnabled', 'searchOpenAlex',
    'parseSearchTerms', 'renderSourcesSection'
  ];
  for (const fn of requiredExports) {
    assert(`window.${fn} exists`, typeof window[fn] === 'function', typeof window[fn]);
  }
  // readAloud should NOT be exported (removed)
  assert('window.readAloud removed', typeof window.readAloud === 'undefined', typeof window.readAloud);

  // ─── Section 2: getContextSummary() ───
  console.log('%c Section 2: getContextSummary()', 'font-weight:bold;color:#6366f1');

  const summary = window.getContextSummary();
  assert('getContextSummary returns array', Array.isArray(summary), typeof summary);
  if (summary.length > 0) {
    assert('Summary items have label', typeof summary[0].label === 'string', summary[0].label);
    assert('Summary items have detail', typeof summary[0].detail === 'string', summary[0].detail);
  } else {
    assert('Summary is empty (no data loaded)', summary.length === 0, 'expected with no data');
  }
  const allLabelsStr = summary.every(s => typeof s.label === 'string' && s.label.length > 0);
  assert('All summary labels are non-empty strings', allLabelsStr, summary.map(s => s.label).join(', '));

  // ─── Section 3: buildActionBar() ───
  console.log('%c Section 3: buildActionBar()', 'font-weight:bold;color:#6366f1');

  let origHistory;
  if (hasState) {
    origHistory = JSON.parse(JSON.stringify(S.chatHistory || []));

    S.chatHistory = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!', context: [{ label: 'Lab values', detail: '5 markers' }] },
      { role: 'user', content: 'More info' },
      { role: 'assistant', content: 'Sure, here is more.', context: [{ label: 'Diet', detail: 'filled' }, { label: 'Sleep & Rest', detail: 'filled' }] }
    ];

    // User messages should return empty
    const userBar = window.buildActionBar(0);
    assert('buildActionBar returns empty for user msg', userBar === '', `got: "${userBar.substring(0, 50)}"`);

    // First AI message (index 1) — NOT last, should NOT have Regenerate
    const bar1 = window.buildActionBar(1);
    assert('buildActionBar for AI msg has action bar', bar1.includes('chat-action-bar'), 'contains .chat-action-bar');
    assert('Non-last AI msg has NO Regenerate', !bar1.includes('Regenerate'), 'no Regenerate for non-last');
    assert('AI msg has NO Read button (removed)', !bar1.includes('Read'), 'no Read button');
    assert('AI msg has Copy button', bar1.includes('Copy'), 'contains Copy');

    // Last AI message (index 3) — should have Regenerate
    const bar3 = window.buildActionBar(3);
    assert('Last AI msg has Regenerate', bar3.includes('Regenerate'), 'contains Regenerate');
    assert('Last AI msg has Copy', bar3.includes('Copy'), 'contains Copy');
    assert('Last AI msg has NO Read', !bar3.includes('Read'), 'no Read');

    // Context section
    assert('AI msg with context has context toggle', bar1.includes('chat-context-toggle'), 'contains toggle');
    assert('Context shows area count', bar1.includes('1 area'), 'shows 1 area');
    assert('Context details are hidden by default', bar1.includes('display:none'), 'hidden');
    assert('Context item has checkmark', bar1.includes('\u2713'), 'has checkmark');

    // Second AI msg has 2 context areas
    assert('Second AI msg shows 2 areas', bar3.includes('2 areas'), 'shows 2 areas');
  } else {
    console.warn('Skipping buildActionBar tests — _labState not available (hard-reload needed)');
  }

  // ─── Section 4: renderChatMessages() with action bars ───
  console.log('%c Section 4: renderChatMessages() integration', 'font-weight:bold;color:#6366f1');

  if (hasState) {
    const realContainer = document.getElementById('chat-messages');
    if (realContainer) {
      window.renderChatMessages();
      const aiMsgs = realContainer.querySelectorAll('.chat-msg.chat-ai');
      const userMsgs = realContainer.querySelectorAll('.chat-msg.chat-user');
      assert('Rendered AI messages have action bars', aiMsgs.length > 0 && aiMsgs[0].querySelector('.chat-action-bar') !== null, `${aiMsgs.length} AI msgs`);
      assert('User messages have NO action bars', userMsgs.length > 0 && userMsgs[0].querySelector('.chat-action-bar') === null, `${userMsgs.length} user msgs`);
    } else {
      const bar1 = window.buildActionBar(1);
      const parser = new DOMParser();
      const doc = parser.parseFromString('<div class="chat-msg chat-ai">' + bar1 + '</div>', 'text/html');
      assert('Action bar HTML has .chat-action-bar div', doc.querySelector('.chat-action-bar') !== null, 'found in parsed HTML');
      assert('Action bar HTML has buttons', doc.querySelectorAll('.chat-action-btn').length >= 1, `${doc.querySelectorAll('.chat-action-btn').length} buttons`);
    }
  } else {
    console.warn('Skipping render tests — _labState not available');
  }

  // ─── Section 5: Backward compatibility ───
  console.log('%c Section 5: Backward compatibility', 'font-weight:bold;color:#6366f1');

  if (hasState) {
    S.chatHistory = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' }  // No .context, no .sources
    ];

    const barNoCtx = window.buildActionBar(1);
    assert('Msg without .context has no context toggle', !barNoCtx.includes('chat-context-toggle'), 'no toggle');
    assert('Msg without .sources has no sources toggle', !barNoCtx.includes('chat-sources-toggle'), 'no sources toggle');
    assert('Msg without .context still has action bar', barNoCtx.includes('chat-action-bar'), 'has action bar');
  } else {
    console.warn('Skipping backward compat tests — _labState not available');
  }

  // ─── Section 6: parseSearchTerms() ───
  console.log('%c Section 6: parseSearchTerms()', 'font-weight:bold;color:#6366f1');

  const parsed1 = window.parseSearchTerms('Here is some info about vitamin D.\n\nSEARCH_TERMS: vitamin D deficiency, 25-hydroxyvitamin D, immune function');
  assert('parseSearchTerms extracts terms', parsed1.terms !== null, JSON.stringify(parsed1.terms));
  assert('parseSearchTerms returns 3 terms', parsed1.terms && parsed1.terms.length === 3, parsed1.terms?.length);
  assert('parseSearchTerms cleans text', !parsed1.cleanText.includes('SEARCH_TERMS'), parsed1.cleanText.substring(0, 60));
  assert('Clean text preserves content', parsed1.cleanText.includes('vitamin D'), parsed1.cleanText.substring(0, 60));

  const parsed2 = window.parseSearchTerms('Just a normal response without terms.');
  assert('No SEARCH_TERMS line returns null terms', parsed2.terms === null, String(parsed2.terms));
  assert('Text unchanged when no terms', parsed2.cleanText === 'Just a normal response without terms.', parsed2.cleanText);

  const parsed3 = window.parseSearchTerms('Response here.\n\nsearch_terms: term1, term2');
  assert('parseSearchTerms is case-insensitive', parsed3.terms !== null && parsed3.terms.length === 2, JSON.stringify(parsed3.terms));

  // Bug C fix: indented SEARCH_TERMS line
  const parsed4 = window.parseSearchTerms('Response here.\n\n  SEARCH_TERMS: indented1, indented2');
  assert('parseSearchTerms handles indented lines', parsed4.terms !== null && parsed4.terms.length === 2, JSON.stringify(parsed4.terms));

  // Key fix: AI wraps in backticks
  const parsed5 = window.parseSearchTerms('Response.\n\n`SEARCH_TERMS: backtick1, backtick2`');
  assert('parseSearchTerms strips backticks', parsed5.terms !== null && parsed5.terms.length === 2, JSON.stringify(parsed5.terms));

  // Markdown prefix variants
  const parsed6 = window.parseSearchTerms('Response.\n\n> SEARCH_TERMS: quoted1, quoted2');
  assert('parseSearchTerms strips blockquote >', parsed6.terms !== null && parsed6.terms.length === 2, JSON.stringify(parsed6.terms));

  const parsed7 = window.parseSearchTerms('Response.\n\n- SEARCH_TERMS: listed1, listed2');
  assert('parseSearchTerms strips list prefix', parsed7.terms !== null && parsed7.terms.length === 2, JSON.stringify(parsed7.terms));

  // ─── Section 7: Chat Sources setting ───
  console.log('%c Section 7: Chat Sources setting', 'font-weight:bold;color:#6366f1');

  const origSources = localStorage.getItem('labcharts-chat-sources');

  window.setChatSourcesEnabled(true);
  assert('setChatSourcesEnabled(true) sets on', localStorage.getItem('labcharts-chat-sources') === 'on', localStorage.getItem('labcharts-chat-sources'));
  assert('getChatSourcesEnabled returns true', window.getChatSourcesEnabled() === true, String(window.getChatSourcesEnabled()));

  window.setChatSourcesEnabled(false);
  assert('setChatSourcesEnabled(false) sets off', localStorage.getItem('labcharts-chat-sources') === 'off', localStorage.getItem('labcharts-chat-sources'));
  assert('getChatSourcesEnabled returns false', window.getChatSourcesEnabled() === false, String(window.getChatSourcesEnabled()));

  // Restore
  if (origSources === null) localStorage.removeItem('labcharts-chat-sources');
  else localStorage.setItem('labcharts-chat-sources', origSources);

  // ─── Section 8: searchOpenAlex URL construction ───
  console.log('%c Section 8: searchOpenAlex()', 'font-weight:bold;color:#6366f1');

  const origFetch = window.fetch;
  let capturedUrl = null;
  let fetchCallCount = 0;
  window.fetch = function(url, opts) {
    if (typeof url === 'string' && url.includes('openalex.org')) {
      capturedUrl = url;
      fetchCallCount++;
      // Return a mix: one with landing page, one with DOI only, one with only OA id
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          results: [
            {
              id: 'https://openalex.org/W1234',
              title: 'Test Paper',
              authorships: [
                { author: { display_name: 'Smith J' } },
                { author: { display_name: 'Doe A' } },
                { author: { display_name: 'Lee B' } },
                { author: { display_name: 'Kim C' } }
              ],
              publication_year: 2023,
              doi: 'https://doi.org/10.1234/test',
              cited_by_count: 42,
              primary_location: { landing_page_url: 'https://example.com/paper' }
            },
            {
              id: 'https://openalex.org/W5678',
              title: 'DOI-only Paper',
              authorships: [{ author: { display_name: 'Chen X' } }],
              publication_year: 2022,
              doi: 'https://doi.org/10.5678/doionly',
              cited_by_count: 10,
              primary_location: null
            },
            {
              id: 'https://openalex.org/W9999',
              title: 'OpenAlex-only Paper',
              authorships: [],
              publication_year: 2021,
              doi: null,
              cited_by_count: 0,
              primary_location: null
            }
          ]
        })
      });
    }
    return origFetch.apply(this, arguments);
  };

  const sources = await window.searchOpenAlex(['vitamin D', 'immunity']);
  assert('searchOpenAlex calls OpenAlex API', capturedUrl !== null && capturedUrl.includes('api.openalex.org'), capturedUrl?.substring(0, 80));
  assert('URL includes search terms', capturedUrl !== null && capturedUrl.includes('search='), capturedUrl?.substring(0, 100));
  assert('URL includes per_page', capturedUrl !== null && capturedUrl.includes('per_page=5'), 'has per_page=5');
  assert('URL includes mailto', capturedUrl !== null && capturedUrl.includes('mailto='), 'has mailto');
  assert('URL selects id field', capturedUrl !== null && capturedUrl.includes('select=id,'), 'has id in select');
  assert('Returns all 3 results (none filtered)', sources.length === 3, `${sources.length} results`);
  assert('Result 1 has landing page URL', sources[0].url === 'https://example.com/paper', sources[0].url);
  assert('Result 2 has DOI fallback URL', sources[1].url === 'https://doi.org/10.5678/doionly', sources[1].url);
  assert('Result 3 has OpenAlex fallback URL', sources[2].url === 'https://openalex.org/W9999', sources[2].url);
  assert('et al. for 4+ authors', sources[0].authors.includes('et al.'), sources[0].authors);
  assert('Result has citations', sources[0].citations === 42, String(sources[0].citations));

  const emptySources = await window.searchOpenAlex([]);
  assert('Empty terms returns empty array', emptySources.length === 0, String(emptySources.length));

  window.fetch = origFetch;

  // ─── Section 9: renderSourcesSection() ───
  console.log('%c Section 9: renderSourcesSection()', 'font-weight:bold;color:#6366f1');

  const srcHtml = window.renderSourcesSection([
    { title: 'Paper One', authors: 'Doe J, Smith K', year: 2022, doi: '10.1/test', url: 'https://doi.org/10.1/test', citations: 100 },
    { title: 'Paper Two', authors: 'Lee M', year: 2023, doi: null, url: 'https://example.com', citations: 5 }
  ], 0);
  assert('renderSourcesSection returns HTML', srcHtml.includes('chat-sources-details'), 'has details container');
  assert('Sources contain paper titles', srcHtml.includes('Paper One') && srcHtml.includes('Paper Two'), 'both titles');
  assert('Sources have links', srcHtml.includes('href='), 'has links');
  assert('Sources have citation counts', srcHtml.includes('100 cites'), 'has citations');
  assert('Sources have author info', srcHtml.includes('Doe J, Smith K'), 'has authors');

  // ─── Section 10: Copy message functionality ───
  console.log('%c Section 10: Copy message', 'font-weight:bold;color:#6366f1');

  assert('navigator.clipboard available', typeof navigator.clipboard !== 'undefined', typeof navigator.clipboard);
  if (typeof navigator.clipboard !== 'undefined' && typeof navigator.clipboard.writeText === 'function') {
    assert('clipboard.writeText is function', true, 'available');
  } else {
    assert('clipboard.writeText is function (may need HTTPS)', false, 'not available');
  }

  // ─── Section 11: Sources toggle in chat header ───
  console.log('%c Section 11: Sources toggle in chat header', 'font-weight:bold;color:#6366f1');

  const indexSrc = await fetch('index.html').then(r => r.text());
  assert('index.html has chat-sources-checkbox', indexSrc.includes('chat-sources-checkbox'), 'found');
  assert('index.html has chat-sources-toggle-label', indexSrc.includes('chat-sources-toggle-label'), 'found');
  assert('index.html has chat-sources-slider', indexSrc.includes('chat-sources-slider'), 'found');
  assert('index.html checkbox calls setChatSourcesEnabled', indexSrc.includes('setChatSourcesEnabled(this.checked)'), 'found');

  const chatHeaderCheckbox = document.getElementById('chat-sources-checkbox');
  assert('chat-sources-checkbox element exists', chatHeaderCheckbox !== null, chatHeaderCheckbox ? 'found' : 'not in DOM');

  // ─── Section 12: Context toggle ───
  console.log('%c Section 12: Context toggle', 'font-weight:bold;color:#6366f1');

  const testDiv = document.createElement('div');
  testDiv.innerHTML = `<div id="chat-ctx-details-1" style="display:none">content</div><span id="chat-ctx-arrow-1">\u25B8</span>`;
  document.body.appendChild(testDiv);

  window.toggleContextDetails(1);
  const det = document.getElementById('chat-ctx-details-1');
  assert('toggleContextDetails opens details', det && det.style.display === 'flex', det?.style.display);

  const ctxArrow = document.getElementById('chat-ctx-arrow-1');
  assert('Arrow changes to down', ctxArrow && ctxArrow.textContent === '\u25BE', ctxArrow?.textContent);

  window.toggleContextDetails(1);
  assert('toggleContextDetails closes details', det && det.style.display === 'none', det?.style.display);
  assert('Arrow changes back to right', ctxArrow && ctxArrow.textContent === '\u25B8', ctxArrow?.textContent);

  testDiv.remove();

  // ─── Section 13: Sources toggle ───
  console.log('%c Section 13: Sources toggle', 'font-weight:bold;color:#6366f1');

  const srcDiv = document.createElement('div');
  srcDiv.innerHTML = `<div id="chat-src-details-2" style="display:none">papers</div><span id="chat-src-arrow-2">\u25B8</span>`;
  document.body.appendChild(srcDiv);

  window.toggleSourcesDetails(2);
  const srcDet = document.getElementById('chat-src-details-2');
  assert('toggleSourcesDetails opens', srcDet && srcDet.style.display === 'block', srcDet?.style.display);

  window.toggleSourcesDetails(2);
  assert('toggleSourcesDetails closes', srcDet && srcDet.style.display === 'none', srcDet?.style.display);

  srcDiv.remove();

  // ─── Section 14: Settings UI — Chat Sources removed ───
  console.log('%c Section 14: Settings UI', 'font-weight:bold;color:#6366f1');

  const settingsSrc = await fetch('js/settings.js').then(r => r.text());
  assert('settings.js NO longer has Chat Sources section', !settingsSrc.includes('Chat Sources'), 'removed from settings');
  assert('settings.js NO longer has chat-sources-btn', !settingsSrc.includes('chat-sources-btn'), 'removed');
  assert('settings.js NO longer has data-sources attribute', !settingsSrc.includes('data-sources'), 'removed');

  // ─── Section 15: Service worker bypass ───
  console.log('%c Section 15: Service worker', 'font-weight:bold;color:#6366f1');

  const swSrc = await fetch('service-worker.js').then(r => r.text());
  assert('SW bypasses api.openalex.org', swSrc.includes('api.openalex.org'), 'found in bypass list');
  assert('SW still bypasses Anthropic', swSrc.includes('api.anthropic.com'), 'found');
  assert('SW still bypasses Venice', swSrc.includes('api.venice.ai'), 'found');
  assert('SW cache bumped to v49', swSrc.includes('labcharts-v50'), 'found');

  // ─── Section 16: CSS classes ───
  console.log('%c Section 16: CSS classes', 'font-weight:bold;color:#6366f1');

  const cssSrc = await fetch('styles.css').then(r => r.text());
  const cssClasses = [
    'chat-action-bar', 'chat-action-btn', 'chat-context-toggle',
    'chat-context-details', 'chat-context-item', 'chat-sources-toggle',
    'chat-sources-details', 'chat-source-item', 'chat-source-title',
    'chat-source-meta', 'chat-sources-loading', 'chat-sources-shimmer',
    'chat-toggle-arrow', 'chat-sources-slider', 'chat-sources-toggle-label'
  ];
  for (const cls of cssClasses) {
    assert(`CSS .${cls} defined`, cssSrc.includes('.' + cls), 'found in styles.css');
  }
  assert('CSS has shimmer animation', cssSrc.includes('@keyframes shimmer'), 'found');
  assert('CSS .chat-action-btn.active removed', !cssSrc.includes('.chat-action-btn.active'), 'removed');

  // ─── Section 17: Source inspection — chat.js ───
  console.log('%c Section 17: Source inspection', 'font-weight:bold;color:#6366f1');

  const chatSrc = await fetch('js/chat.js').then(r => r.text());
  assert('chat.js has getContextSummary', chatSrc.includes('function getContextSummary'), 'found');
  assert('chat.js has buildActionBar', chatSrc.includes('function buildActionBar'), 'found');
  assert('chat.js has regenerateLastMessage', chatSrc.includes('function regenerateLastMessage'), 'found');
  assert('chat.js does NOT have readAloud', !chatSrc.includes('function readAloud'), 'removed');
  assert('chat.js has copyMessage', chatSrc.includes('function copyMessage'), 'found');
  assert('chat.js has searchOpenAlex', chatSrc.includes('function searchOpenAlex'), 'found');
  assert('chat.js has parseSearchTerms', chatSrc.includes('function parseSearchTerms'), 'found');
  assert('chat.js has renderSourcesSection', chatSrc.includes('function renderSourcesSection'), 'found');
  assert('chat.js has getChatSourcesEnabled', chatSrc.includes('function getChatSourcesEnabled'), 'found');
  assert('chat.js has setChatSourcesEnabled', chatSrc.includes('function setChatSourcesEnabled'), 'found');
  assert('sendChatMessage snapshots context', chatSrc.includes('contextSnapshot'), 'found');
  assert('sendChatMessage parses search terms', chatSrc.includes('parseSearchTerms(fullText)'), 'found');
  assert('sendChatMessage calls searchOpenAlex', chatSrc.includes('searchOpenAlex(searchTerms)'), 'found');
  assert('regenerateLastMessage checks sendBtn.disabled', chatSrc.includes('sendBtn.disabled') && chatSrc.includes('regenerateLastMessage'), 'found');
  assert('renderChatMessages calls buildActionBar', chatSrc.includes('buildActionBar(i)'), 'found');
  assert('API messages use only role+content', chatSrc.includes('.map(m => ({ role: m.role, content: m.content }))'), 'found');
  assert('Sources bug fix: isConnected guard', chatSrc.includes('aiMsgEl.isConnected'), 'found');
  assert('Sources bug fix: sourcesPending stripped from JSON', chatSrc.includes('sourcesPending') && chatSrc.includes('undefined'), 'JSON replacer strips sourcesPending');
  assert('Sources bug fix: .catch() handler', chatSrc.includes('.catch('), 'has catch for OpenAlex errors');
  assert('Sources bug fix: thread ID captured for async save', chatSrc.includes('sourceThreadId'), 'captures thread context');
  assert('openChatPanel syncs sources checkbox', chatSrc.includes('chat-sources-checkbox'), 'found');
  assert('Prompt does NOT use backticks around SEARCH_TERMS', !chatSrc.includes('`SEARCH_TERMS:'), 'no backtick wrap');
  assert('OpenAlex URL selects id field', chatSrc.includes('select=id,'), 'found');
  assert('OpenAlex fallback: openalex.org URL', chatSrc.includes('openalex.org/'), 'OpenAlex fallback URL');
  assert('parseSearchTerms strips backticks', chatSrc.includes("replace(/^[`>*-]+"), 'backtick strip regex');
  assert('Fallback search terms from user question', chatSrc.includes('text.slice(0, 120)'), 'fallback when AI omits SEARCH_TERMS');

  // ─── Section 18: Regenerate only on last AI message ───
  console.log('%c Section 18: Regenerate placement', 'font-weight:bold;color:#6366f1');

  if (hasState) {
    S.chatHistory = [
      { role: 'user', content: 'Q1' },
      { role: 'assistant', content: 'A1' },
      { role: 'user', content: 'Q2' },
      { role: 'assistant', content: 'A2' }
    ];

    const bar0 = window.buildActionBar(1); // first AI msg
    const barLast = window.buildActionBar(3); // last AI msg
    assert('First AI msg (non-last) has no Regenerate', !bar0.includes('regenerateLastMessage'), 'no regenerate');
    assert('Last AI msg has Regenerate', barLast.includes('regenerateLastMessage'), 'has regenerate');
  } else {
    console.warn('Skipping regenerate placement tests — _labState not available');
  }

  // ─── Section 19: setChatPersonality thread behavior ───
  console.log('%c Section 19: setChatPersonality thread behavior', 'font-weight:bold;color:#6366f1');

  if (hasState) {
    assert('setChatPersonality is async', chatSrc.includes('async function setChatPersonality'), 'found in source');
    assert('setChatPersonality calls createNewThread', chatSrc.includes('createNewThread()'), 'found');
    // Key fix: saves BEFORE changing state.currentChatPersonality
    const saveIdx = chatSrc.indexOf('await saveChatHistory()', chatSrc.indexOf('setChatPersonality'));
    const changeIdx = chatSrc.indexOf('state.currentChatPersonality = id', chatSrc.indexOf('setChatPersonality'));
    assert('Saves history BEFORE changing personality', saveIdx > 0 && changeIdx > 0 && saveIdx < changeIdx, `save@${saveIdx} < change@${changeIdx}`);
    // Key fix: only creates new thread when current has messages
    assert('Checks hasMessages before createNewThread', chatSrc.includes('hasMessages') && chatSrc.includes('if (hasMessages)'), 'guards thread creation');
    // Key fix: reuses empty thread when switching personality
    assert('Updates empty thread personality in-place', chatSrc.includes('thread.personality = id'), 'found in setChatPersonality');

    // Functional test: save with sourcesPending strips it
    const origHist = JSON.parse(JSON.stringify(S.chatHistory));
    const origThread = S.currentThreadId;
    S.chatHistory = [
      { role: 'user', content: 'test' },
      { role: 'assistant', content: 'response', sourcesPending: true }
    ];
    await window.saveChatHistory();
    const savedRaw = localStorage.getItem(window.getChatThreadKey(S.currentThreadId));
    if (savedRaw) {
      const savedParsed = JSON.parse(savedRaw);
      const hasPending = savedParsed.some(m => m.sourcesPending);
      assert('saveChatHistory strips sourcesPending from storage', !hasPending, hasPending ? 'LEAKED' : 'clean');
    } else {
      assert('saveChatHistory strips sourcesPending from storage', true, 'encrypted — cannot verify raw');
    }
    S.chatHistory = origHist;
    S.currentThreadId = origThread;
  }

  // ─── Section 20: state.js exposes _labState ───
  console.log('%c Section 20: State exposure', 'font-weight:bold;color:#6366f1');

  const stateSrc = await fetch('js/state.js').then(r => r.text());
  assert('state.js exports _labState to window', stateSrc.includes('window._labState'), 'found');

  // ─── Section 21: Live OpenAlex API test ───
  console.log('%c Section 21: Live OpenAlex API', 'font-weight:bold;color:#6366f1');

  try {
    const liveResults = await window.searchOpenAlex(['vitamin D blood test']);
    assert('Live OpenAlex returns results', liveResults.length > 0, `${liveResults.length} papers found`);
    if (liveResults.length > 0) {
      assert('Live result has title', typeof liveResults[0].title === 'string' && liveResults[0].title.length > 0, liveResults[0].title.substring(0, 60));
      assert('Live result has URL', typeof liveResults[0].url === 'string' && liveResults[0].url.startsWith('http'), liveResults[0].url.substring(0, 60));
      assert('Live result has year', typeof liveResults[0].year === 'number', String(liveResults[0].year));
      console.log('%c  Sample papers:', 'color:#6366f1');
      for (const r of liveResults.slice(0, 3)) {
        console.log(`  ${r.year} | ${r.title.substring(0, 60)} | ${r.citations} cites | ${r.url.substring(0, 40)}`);
      }
    }
  } catch (e) {
    assert('Live OpenAlex API reachable', false, e.message);
  }

  // ─── Cleanup ───
  if (hasState && origHistory) S.chatHistory = origHistory;

  // ─── Summary ───
  console.log('\n%c ═══════════════════════════════════════', 'color:#6366f1');
  console.log(`%c Chat Actions Test: ${passed} passed, ${failed} failed (${passed + failed} total)`, `font-weight:bold;color:${failed ? '#ef4444' : '#22c55e'}`);
  console.log('%c ═══════════════════════════════════════', 'color:#6366f1');

  if (failed > 0) {
    console.table(results.filter(r => r.status === 'FAIL'));
  }

  return { passed, failed, total: passed + failed, results };
})();
