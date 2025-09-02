/*! REVREBEL Word Count Module
 *
 * Calculates the word count of a rich text element and dispatches a
 * 'wordCountReady' event with the result.
 *
 * Usage:
 *  - Add `data-wordcount="reading-article"` to the rich text container.
 *  - Listen for the 'wordCountReady' event on the document.
 *    e.g., document.addEventListener('wordCountReady', (e) => {
 *      console.log('Word count is:', e.detail.count);
 *    });
 */
(function () {
  "use strict";

  /**
   * Waits for an element to appear in the DOM using MutationObserver.
   * This is more robust than polling for elements that may be added late by frameworks.
   * @param {string} selector - The CSS selector for the target element.
   * @param {(element: HTMLElement | null) => void} callback - Called when the element is found or on timeout.
   */
  function waitForElement(selector, callback) {
    let element = document.querySelector(selector);
    if (element) {
      console.log('[Word Count] Element found immediately.');
      callback(element);
      return;
    }

    let observer;
    let timeoutId;

    const cleanup = () => {
      if (observer) observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };

    observer = new MutationObserver(() => {
      element = document.querySelector(selector);
      if (element) {
        console.log('[Word Count] Element found by MutationObserver.');
        cleanup();
        callback(element);
      }
    });

    console.log(`[Word Count] Waiting for element: "${selector}"...`);
    observer.observe(document.body, { childList: true, subtree: true });

    timeoutId = setTimeout(() => {
      cleanup();
      const finalElement = document.querySelector(selector);
      if (!finalElement) {
        console.log('[Word Count] Timed out waiting for element.');
      }
      callback(finalElement); // Will be null if not found
    }, 5000); // Stop observing after 5 seconds
  }

  function init() {
    console.log('[Word Count] Initializing...');
    waitForElement('[data-wordcount="reading-article"]', (richTextField) => {
      const text = richTextField ? (richTextField.innerText || richTextField.textContent || "") : "";
      const finalWordCount = text.split(/\s+/).filter(Boolean).length;

      // Store the result on a global object for any scripts that load late.
      window.__revrebel_wc = {
        count: finalWordCount > 0 ? finalWordCount : undefined,
        ready: true
      };

      // Dispatch a custom event with the word count.
      document.dispatchEvent(new CustomEvent('wordCountReady', {
        detail: { count: finalWordCount > 0 ? finalWordCount : undefined }
      }));
      console.log(`[Word Count] Dispatched "wordCountReady" event with count: ${finalWordCount > 0 ? finalWordCount : 'N/A'}.`);
    });
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();