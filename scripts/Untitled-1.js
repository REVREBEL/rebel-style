(function () {
  "use strict";

  /**
   * Finds emoji characters within a given element and its descendants
   * and wraps them in a <span> with a class specified in a data attribute.
   * @param {Element} rootElement - The element to scan for emoji containers.
   */
  function processElements(rootElement) {
    // Find all elements with the data attribute, including the root if it has it.
    const elements = rootElement.matches('[data-font-emoji]')
      ? [rootElement, ...rootElement.querySelectorAll('[data-font-emoji]')]
      : rootElement.querySelectorAll('[data-font-emoji]');

    elements.forEach(el => {
      // Get the class to apply from the data attribute.
      const emojiClass = el.getAttribute('data-font-emoji');
      // Skip if no class is specified or if we've already styled this element.
      if (!emojiClass || el.dataset.emojiStyled) return;

      const emojiRegex = /(\p{Extended_Pictographic}|\p{Emoji})+/ug;

      if (emojiRegex.test(el.textContent)) {
        el.innerHTML = el.innerHTML.replace(emojiRegex, `<span class="${emojiClass}">$&</span>`);
        el.dataset.emojiStyled = 'true'; // Mark as processed to prevent re-running.
      }
    });
  }

  /**
   * Initializes the emoji styling and sets up a MutationObserver to handle
   * dynamically added content.
   */
  function init() {
    // Process any elements that are already on the page.
    processElements(document.body);

    // Observe the body for new nodes being added.
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) processElements(node);
          });
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
