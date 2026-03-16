// test-image-utils.js — Verify image attachment utilities and vision support
// Run: fetch('tests/test-image-utils.js').then(r=>r.text()).then(s=>Function(s)())

(async function() {
  let pass = 0, fail = 0;
  function assert(name, condition, detail) {
    if (condition) { pass++; console.log(`%c PASS %c ${name}`, 'background:#22c55e;color:#fff;padding:2px 6px;border-radius:3px', '', detail || ''); }
    else { fail++; console.error(`%c FAIL %c ${name}`, 'background:#ef4444;color:#fff;padding:2px 6px;border-radius:3px', '', detail || ''); }
  }

  console.log('%c Image Utils Tests ', 'background:#6366f1;color:#fff;font-size:14px;padding:4px 12px;border-radius:4px');

  // ═══════════════════════════════════════
  // 1. Module exports available on window
  // ═══════════════════════════════════════
  console.log('%c 1. Module Exports ', 'font-weight:bold;color:#f59e0b');

  assert('resizeImage exported', typeof window.resizeImage === 'function');
  assert('isValidImageType exported', typeof window.isValidImageType === 'function');
  assert('formatImageBlock exported', typeof window.formatImageBlock === 'function');
  assert('buildVisionContent exported', typeof window.buildVisionContent === 'function');
  assert('supportsVision exported', typeof window.supportsVision === 'function');
  assert('addImageAttachment exported', typeof window.addImageAttachment === 'function');
  assert('removeImageAttachment exported', typeof window.removeImageAttachment === 'function');
  assert('clearAttachments exported', typeof window.clearAttachments === 'function');
  assert('updateAttachButtonVisibility exported', typeof window.updateAttachButtonVisibility === 'function');
  assert('initChatImageHandlers exported', typeof window.initChatImageHandlers === 'function');

  // ═══════════════════════════════════════
  // 2. isValidImageType
  // ═══════════════════════════════════════
  console.log('%c 2. isValidImageType ', 'font-weight:bold;color:#f59e0b');

  assert('JPEG valid', window.isValidImageType('image/jpeg'));
  assert('PNG valid', window.isValidImageType('image/png'));
  assert('GIF valid', window.isValidImageType('image/gif'));
  assert('WebP valid', window.isValidImageType('image/webp'));
  assert('PDF rejected', !window.isValidImageType('application/pdf'));
  assert('SVG rejected', !window.isValidImageType('image/svg+xml'));
  assert('empty rejected', !window.isValidImageType(''));

  // ═══════════════════════════════════════
  // 3. formatImageBlock
  // ═══════════════════════════════════════
  console.log('%c 3. formatImageBlock ', 'font-weight:bold;color:#f59e0b');

  const b64 = 'dGVzdA=='; // "test" in base64
  const anthropicBlock = window.formatImageBlock(b64, 'image/jpeg', 'anthropic');
  assert('Anthropic block type', anthropicBlock.type === 'image');
  assert('Anthropic source type', anthropicBlock.source.type === 'base64');
  assert('Anthropic media_type', anthropicBlock.source.media_type === 'image/jpeg');
  assert('Anthropic data', anthropicBlock.source.data === b64);

  const openaiBlock = window.formatImageBlock(b64, 'image/png', 'openrouter');
  assert('OpenAI block type', openaiBlock.type === 'image_url');
  assert('OpenAI URL starts with data:', openaiBlock.image_url.url.startsWith('data:image/png;base64,'));
  assert('OpenAI URL contains base64', openaiBlock.image_url.url.includes(b64));

  const veniceBlock = window.formatImageBlock(b64, 'image/jpeg', 'venice');
  assert('Venice uses OpenAI format', veniceBlock.type === 'image_url');

  const ollamaBlock = window.formatImageBlock(b64, 'image/jpeg', 'ollama');
  assert('Ollama uses OpenAI format', ollamaBlock.type === 'image_url');

  // ═══════════════════════════════════════
  // 4. buildVisionContent
  // ═══════════════════════════════════════
  console.log('%c 4. buildVisionContent ', 'font-weight:bold;color:#f59e0b');

  const imgBlocks = [anthropicBlock, anthropicBlock];
  const content = window.buildVisionContent(imgBlocks, 'What is this?', 'anthropic');
  assert('Vision content has images + text', content.length === 3);
  assert('Last element is text', content[2].type === 'text' && content[2].text === 'What is this?');

  const noText = window.buildVisionContent([anthropicBlock], '', 'anthropic');
  assert('Empty text omitted', noText.length === 1);

  // ═══════════════════════════════════════
  // 5. PDF text quality assessment
  // ═══════════════════════════════════════
  console.log('%c 5. assessTextQuality ', 'font-weight:bold;color:#f59e0b');

  assert('assessTextQuality exported', typeof window.assessTextQuality === 'function');
  assert('Empty text = empty', window.assessTextQuality('') === 'empty');
  assert('Null text = empty', window.assessTextQuality(null) === 'empty');
  assert('Short text = poor', window.assessTextQuality('just a few words') === 'poor');
  assert('Good text', window.assessTextQuality('This is a normal lab report with glucose creatinine albumin and many other biomarker results that span multiple lines of text with values and reference ranges included for comprehensive analysis') === 'good');

  // ═══════════════════════════════════════
  // 6. HTML structure
  // ═══════════════════════════════════════
  console.log('%c 6. HTML Structure ', 'font-weight:bold;color:#f59e0b');

  assert('chat-attach-btn exists', !!document.getElementById('chat-attach-btn'));
  assert('chat-attach-preview exists', !!document.getElementById('chat-attach-preview'));
  assert('chat-image-input exists', !!document.getElementById('chat-image-input'));
  assert('chat-input-row wraps inputs', !!document.querySelector('.chat-input-row'));
  const fileInput = document.getElementById('chat-image-input');
  assert('File input accepts images', fileInput && fileInput.accept.includes('image/'));

  // ═══════════════════════════════════════
  // 7. CSS classes exist
  // ═══════════════════════════════════════
  console.log('%c 7. CSS Classes ', 'font-weight:bold;color:#f59e0b');

  const styleSheets = [...document.styleSheets];
  let allRules = '';
  for (const ss of styleSheets) {
    try { for (const rule of ss.cssRules) allRules += rule.cssText + '\n'; } catch {}
  }
  assert('.chat-attach-btn style exists', allRules.includes('.chat-attach-btn'));
  assert('.chat-attach-preview style exists', allRules.includes('.chat-attach-preview'));
  assert('.chat-attach-thumb style exists', allRules.includes('.chat-attach-thumb'));
  assert('.chat-attach-remove style exists', allRules.includes('.chat-attach-remove'));
  assert('.chat-image-badge style exists', allRules.includes('.chat-image-badge'));
  assert('.chat-drop-active style exists', allRules.includes('.chat-drop-active'));

  // ═══════════════════════════════════════
  // 8. PDF image fallback exports
  // ═══════════════════════════════════════
  console.log('%c 8. PDF Image Fallback ', 'font-weight:bold;color:#f59e0b');

  assert('extractPDFImages exported', typeof window.extractPDFImages === 'function');
  assert('parseLabPDFWithAIImages exported', typeof window.parseLabPDFWithAIImages === 'function');

  // ═══════════════════════════════════════
  // 9. Source code checks
  // ═══════════════════════════════════════
  console.log('%c 9. Source Code ', 'font-weight:bold;color:#f59e0b');

  const apiSrc = await fetch('js/api.js').then(r => r.text());
  assert('supportsVision function in api.js', apiSrc.includes('export function supportsVision'));
  assert('Vision models cached in fetchOpenRouterModels', apiSrc.includes('labcharts-openrouter-vision-models'));
  assert('Ollama image normalization', apiSrc.includes('ollamaMsg.images = images'));

  const chatSrc = await fetch('js/chat.js').then(r => r.text());
  assert('Chat imports supportsVision', chatSrc.includes('supportsVision'));
  assert('Chat imports image-utils', chatSrc.includes("from './image-utils.js'"));
  assert('Pending attachments variable', chatSrc.includes('_pendingAttachments'));
  assert('Image badge in renderChatMessages', chatSrc.includes('chat-image-badge'));
  assert('buildVisionContent used in sendChatMessage', chatSrc.includes('buildVisionContent(imageBlocks'));

  const pdfSrc = await fetch('js/pdf-import.js').then(r => r.text());
  assert('assessTextQuality in pdf-import', pdfSrc.includes('export function assessTextQuality'));
  assert('extractPDFImages in pdf-import', pdfSrc.includes('export async function extractPDFImages'));
  assert('parseLabPDFWithAIImages in pdf-import', pdfSrc.includes('export async function parseLabPDFWithAIImages'));
  assert('handleImageFile in pdf-import', pdfSrc.includes('export async function handleImageFile'));
  assert('Auto image mode for poor text quality', pdfSrc.includes("useImageMode = true"));

  // ═══════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════
  console.log(`\n%c Image Utils: ${pass} passed, ${fail} failed `, fail > 0 ? 'background:#ef4444;color:#fff;font-size:14px;padding:4px 12px;border-radius:4px' : 'background:#22c55e;color:#fff;font-size:14px;padding:4px 12px;border-radius:4px');
  if (typeof window.__TEST_RESULTS === 'undefined') window.__TEST_RESULTS = {};
  window.__TEST_RESULTS['test-image-utils'] = { pass, fail };
})();
