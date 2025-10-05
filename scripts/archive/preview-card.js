/*! ------------------ ADDING THE SCRIPT: ------------------ 

<!-- START Preview Card -->
<script
  defer
  src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/preview-card.js"
  type="text/javascript"
  referrerpolicy="no-referrer"
  crossorigin="anonymous">
</script>
<!-- END Preview Card -->

*/

/*! ------------------ HOW TO USE IN WEBFLOW --------------- 
/**
 * Minimal CSS (recommended)
 * 
 * Ensure default state is hidden; JS will set to flex when shown.
 * .summary-preview-card { display: none; }
 * 
 * Your layout when visible.
 * summary-preview-card[data-preview-visible="true"] { display: flex; }
 * 
 * Example HTML wiring
 * 
 * <button preview-trigger="abc" type="button">Open Preview A</button>
 * <div preview-target="abc">
 * <div class="summary-preview-card">
 *   <!-- preview content -->
 *   <button preview-close="abc" type="button" aria-label="Close preview">Close</button>
 * </div>
 * </div>
 * 
 */


(function () {
  "use strict";

  /**
   * Finds the closest ancestor (or self) with a given attribute.
   * Useful for event delegation when clicks land on child elements (e.g., icons inside a button).
   *
   * @param {Element} el - The starting element.
   * @param {string} attr - The attribute name to find.
   * @returns {HTMLElement|null} The element with the attribute, or null if not found.
   */
  function closestWithAttr(el, attr) {
    while (el && el !== document && el !== document.documentElement) {
      if (el.hasAttribute(attr)) return el;
      el = el.parentNode;
    }
    return null;
  }

  /**
   * Finds the target container and the preview card within it based on a shared value.
   *
   * @param {string} value - The value of the preview-trigger/target/close attribute.
   * @returns {{target: HTMLElement|null, card: HTMLElement|null}} An object containing:
   *  - `target`: The container element that matches the value.
   *  - `card`: The `.summary-preview-card` element inside the target, or null if not found.
   */
  function getTargetAndCard(value) {
    if (!value) return {};
    const target = document.querySelector(`[preview-target="${CSS.escape(value)}"]`);
    if (!target) return { target: null, card: null };

    const card = target.classList.contains('summary-preview-card')
      ? target
      : target.querySelector('.summary-preview-card');

    return { target: target, card: card };
  }

  /**
   * Shows a preview card and updates its ARIA attributes for accessibility.
   *
   * @param {HTMLElement} card - The `.summary-preview-card` element to show.
   * @returns {void}
   */
  function showCard(card) {
    if (!card) return;
    card.style.display = 'flex';
    card.setAttribute('data-preview-visible', 'true');
    card.setAttribute('aria-hidden', 'false');
  }

  /**
   * Hides a preview card and updates its ARIA attributes for accessibility.
   *
   * @param {HTMLElement} card - The `.summary-preview-card` element to hide.
   * @returns {void}
   */
  function hideCard(card) {
    if (!card) return;
    card.style.display = 'none';
    card.setAttribute('data-preview-visible', 'false');
    card.setAttribute('aria-hidden', 'true');
  }

  /**
   * Determines if a keyboard event represents an activation key.
   * Activation keys are `Enter` or `Space`.
   *
   * @param {KeyboardEvent} e - The keyboard event.
   * @returns {boolean} True if the key is an activation key, otherwise false.
   */
  function isActivateKey(e) {
    const code = e.code || e.key || '';
    return code === 'Enter' || code === ' ' || code === 'Spacebar';
  }

  /**
   * Handles click events for triggers and close buttons using event delegation.
   *
   * @param {MouseEvent} e - The click event.
   * @returns {void}
   */
  function handleClick(e) {
    const triggerEl = closestWithAttr(e.target, 'preview-trigger');
    if (triggerEl) {
      e.preventDefault();
      const value = triggerEl.getAttribute('preview-trigger');
      const { card: cardToShow } = getTargetAndCard(value);

      // Hide all other visible cards before showing the new one
      document.querySelectorAll('.summary-preview-card[data-preview-visible="true"]').forEach(visibleCard => {
        if (visibleCard !== cardToShow) {
          const closeValue = visibleCard.querySelector('[preview-close]')?.getAttribute('preview-close');
          hideCard(visibleCard);
          const triggerToClose = document.querySelector(`[preview-trigger="${CSS.escape(closeValue)}"]`);
          if (triggerToClose) triggerToClose.setAttribute('aria-expanded', 'false');
        }
      });

      const { card } = getTargetAndCard(value);
      if (card) showCard(card);
      triggerEl.setAttribute('aria-expanded', 'true');
      return;
    }

    const closeEl = closestWithAttr(e.target, 'preview-close');
    if (closeEl) {
      e.preventDefault();
      const value = closeEl.getAttribute('preview-close');
      const { card } = getTargetAndCard(value);
      if (card) {
        hideCard(card);
        const triggerToClose = document.querySelector(`[preview-trigger="${CSS.escape(value)}"]`);
        if (triggerToClose) triggerToClose.setAttribute('aria-expanded', 'false');
      }
    }
  }

  /**
   * Handles keyboard events for triggers and close buttons to support accessibility.
   *
   * @param {KeyboardEvent} e - The keydown event.
   * @returns {void}
   */
  function handleKeydown(e) {
    if (!isActivateKey(e)) return;

    const triggerEl = closestWithAttr(e.target, 'preview-trigger');
    if (triggerEl) {
      e.preventDefault();
      const value = triggerEl.getAttribute('preview-trigger');
      const { card: cardToShow } = getTargetAndCard(value);

      // Hide all other visible cards before showing the new one
      document.querySelectorAll('.summary-preview-card[data-preview-visible="true"]').forEach(visibleCard => {
        if (visibleCard !== cardToShow) {
          const closeValue = visibleCard.querySelector('[preview-close]')?.getAttribute('preview-close');
          hideCard(visibleCard);
          const triggerToClose = document.querySelector(`[preview-trigger="${CSS.escape(closeValue)}"]`);
          if (triggerToClose) triggerToClose.setAttribute('aria-expanded', 'false');
        }
      });

      const { card } = getTargetAndCard(value);
      if (card) showCard(card);
      triggerEl.setAttribute('aria-expanded', 'true');
      return;
    }

    const closeEl = closestWithAttr(e.target, 'preview-close');
    if (closeEl) {
      e.preventDefault();
      const value = closeEl.getAttribute('preview-close');
      const { card } = getTargetAndCard(value);
      if (card) {
        hideCard(card);
        const triggerToClose = document.querySelector(`[preview-trigger="${CSS.escape(value)}"]`);
        if (triggerToClose) triggerToClose.setAttribute('aria-expanded', 'false');
      }
    }
  }

  /**
   * Initializes the script by:
   * - Hiding all preview cards initially.
   * - Setting ARIA state for triggers.
   * - Adding event listeners for click and keyboard interactions.
   *
   * @returns {void}
   */
  function init() {
    document.querySelectorAll('.summary-preview-card').forEach(hideCard);

    document.querySelectorAll('[preview-trigger]').forEach(trigger => {
      trigger.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeydown);
  }

  // Run the script once the DOM is fully loaded.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

