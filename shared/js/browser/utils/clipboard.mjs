/**
 * Given a username, returns a valid email address with the duck domain
 * @param {string} address
 * @returns {string}
 */
export const formatAddress = (address) => address + '@duck.com';

/**
 * Copies text to the clipboard using navigator.clipboard with a fallback to document.execCommand('copy').
 * This ensures reliability in environments (such as Firefox web extension popups) where async clipboard writes
 * may be blocked due to lack of transient user activation.
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (e) {
            console.warn('navigator.clipboard.writeText failed, attempting execCommand fallback', e);
        }
    }
    try {
        if (typeof document !== 'undefined') {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.setAttribute('readonly', '');
            textarea.style.contain = 'strict';
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            textarea.style.fontSize = '12pt';
            const selection = document.getSelection();
            const originalRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
            document.body.appendChild(textarea);
            textarea.select();
            textarea.selectionStart = 0;
            textarea.selectionEnd = text.length;
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            if (originalRange && selection) {
                selection.removeAllRanges();
                selection.addRange(originalRange);
            }
            return success;
        }
    } catch (err) {
        console.error('execCommand copy fallback failed', err);
    }
    return false;
}
