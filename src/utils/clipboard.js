/**
 * Universal Clipboard Copy Utility
 * Provides cross-browser clipboard copy support using navigator.clipboard.writeText
 * with seamless fallback to a hidden textarea and document.execCommand('copy').
 *
 * @param {string} text - Text to copy to clipboard
 * @returns {Promise<boolean>} - Resolves to true on success, false on failure
 */
export const copyToClipboard = async (text) => {
  if (typeof text !== 'string' || !text) return false;

  // 1. Try Modern Clipboard API
  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Modern API rejected (e.g. lack of focus or permission), continue to fallback
    }
  }

  // 2. Fallback using temporary textarea & document.execCommand
  if (typeof document !== 'undefined') {
    try {
      const el = document.createElement('textarea');
      el.value = text;
      el.setAttribute('readonly', '');
      el.style.position = 'fixed';
      el.style.left = '-9999px';
      el.style.top = '0';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(el);
      return Boolean(successful);
    } catch {
      return false;
    }
  }

  return false;
};
