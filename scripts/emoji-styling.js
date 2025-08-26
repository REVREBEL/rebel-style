/*! REVREBEL Emoji Styling Module (Webflow) --------------------- 
 *
 * Automatically scans elements with the `.category-label` class
 * and wraps detected emoji characters in a <span> element for
 * consistent styling across browsers.
 *
 * Usage:
 *  - Add `data-font-emoji="is-emoji-font"` (or your own class) to `.category-label` elements
 *  - Script will wrap emojis in a <span> with that class
 */

/*! ------------------ ADDING THE SCRIPT: ------------------ 

<!-- START Emoji Styling Module  -->

<script
defer src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/emoji-styling.js"
type="text/javascript" 
referrerpolicy="no-referrer" 
crossorigin="anonymous" 
>
</script>

<!-- END Emoji Styling Module -->
*/


(function () {
  "use strict";

  /**
   * Initialize emoji styling on all `.category-label` elements.
   *
   * - Looks for a `data-font-emoji` attribute to determine the span class.
   * - Uses a Unicode-aware regex to detect emoji characters.
   * - Wraps each emoji in a <span> for custom font styling.
   *
   * @function initEmojiStyling
   * @returns {void}
   */
  function initEmojiStyling() {
    document.querySelectorAll('.category-label').forEach((el) => {
      /** @type {string|null} */
      const emojiClass = el.getAttribute('data-font-emoji');
      if (!emojiClass) return; // Skip if no class is specified.

      /**
       * Regex to find emoji sequences.
       * - \p{Extended_Pictographic} covers most emojis.
       * - \p{Emoji} matches additional emoji characters.
       * - The 'u' flag enables Unicode support.
       * - The 'g' flag finds all occurrences.
       */
      const emojiRegex = /(\p{Extended_Pictographic}|\p{Emoji})+/ug;

      if (emojiRegex.test(el.textContent)) {
        el.innerHTML = el.innerHTML.replace(
          emojiRegex,
          `<span class="${emojiClass}">$&</span>`
        );
      }
    });
  }

  // -------------------------------------------------------------------
  // Auto-init once DOM is ready
  // -------------------------------------------------------------------

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEmojiStyling);
  } else {
    initEmojiStyling();
  }
})();

