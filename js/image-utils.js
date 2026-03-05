// image-utils.js — Shared image utilities for chat attachments and PDF image fallback
// No app imports (no circular deps)

// ═══════════════════════════════════════════════
// RESIZE IMAGE
// ═══════════════════════════════════════════════
/**
 * Resize an image file to fit within maxDim, return base64 JPEG.
 * @param {File} file
 * @param {number} maxDim - max long-side pixels (default 1024 for chat, 2048 for PDF)
 * @param {number} quality - JPEG quality 0-1
 * @returns {Promise<{base64: string, mediaType: string, width: number, height: number}>}
 */
export function resizeImage(file, maxDim = 1024, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      // Use original type for PNG (transparency), JPEG for everything else
      const isPng = file.type === 'image/png';
      const outputType = isPng ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(outputType, quality);
      const base64 = dataUrl.split(',')[1];
      const mediaType = isPng ? 'image/png' : 'image/jpeg';
      resolve({ base64, mediaType, width, height });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

// ═══════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════
export function isValidImageType(type) {
  return /^image\/(jpeg|png|gif|webp)$/.test(type);
}

// ═══════════════════════════════════════════════
// FORMAT IMAGE BLOCK (provider-specific)
// ═══════════════════════════════════════════════
/**
 * Returns a single image content block in the format expected by the provider.
 * @param {string} base64 - raw base64 data (no prefix)
 * @param {string} mediaType - e.g. 'image/jpeg'
 * @param {string} provider - 'anthropic', 'openrouter', 'venice', 'ollama'
 */
export function formatImageBlock(base64, mediaType, provider) {
  if (provider === 'anthropic') {
    return { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } };
  }
  // OpenAI-compatible (OpenRouter, Venice, Local AI)
  return { type: 'image_url', image_url: { url: `data:${mediaType};base64,${base64}` } };
}

// ═══════════════════════════════════════════════
// BUILD VISION CONTENT ARRAY
// ═══════════════════════════════════════════════
/**
 * Builds a content array with image blocks + text block.
 * @param {Array} imageBlocks - from formatImageBlock()
 * @param {string} text
 * @param {string} provider
 * @returns {Array} content array for the messages API
 */
export function buildVisionContent(imageBlocks, text, provider) {
  const content = [...imageBlocks];
  if (text) {
    content.push({ type: 'text', text });
  }
  return content;
}

Object.assign(window, {
  resizeImage,
  isValidImageType,
  formatImageBlock,
  buildVisionContent,
});
