(function () {
  "use strict";

  /**
   * Finds emoji characters within elements having a `.category-label` class
   * and wraps them in a <span> with a specified class to allow for custom font styling.
   * This is useful for ensuring consistent emoji rendering across browsers.
   */
  function initEmojiStyling() {
    document.querySelectorAll('.category-label').forEach(el => {
      // Get the class to apply from the data attribute.
      const emojiClass = el.getAttribute('data-font-emoji');
      if (!emojiClass) return; // Skip if no class is specified.

      // This regex finds one or more consecutive emoji characters.
      // The 'u' flag enables Unicode support, and 'g' finds all occurrences.
      const emojiRegex = /(\p{Extended_Pictographic}|\p{Emoji})+/ug;

      // We must check for a match before modifying innerHTML to avoid potential issues.
      if (emojiRegex.test(el.textContent)) {
        // Replace all found emojis with a span wrapping the emoji.
        // `$&` in the replacement string is a special pattern that inserts the matched substring.
        el.innerHTML = el.innerHTML.replace(emojiRegex, `<span class="${emojiClass}">$&</span>`);
      }
    });
  }

  // Run the script after the DOM is fully loaded.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEmojiStyling);
  } else {
    initEmojiStyling();
  }
})();
