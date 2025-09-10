/**
 * @file disable-scroll.js
 * @description
 * Neue World's Disable Scroll Tool for Webflow.
 *
 * This script toggles the ability to scroll the page on and off when a specified
 * element is clicked. It is useful for modals, menus, or any UI state where you
 * want to temporarily lock page scrolling.
 *
 * ------------------ ADDING THE SCRIPT ------------------
 *
 * <!-- START Disable Scroll -->
 * <script
 *   defer
 *   src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/disable-scroll.js"
 *   type="text/javascript"
 *   referrerpolicy="no-referrer"
 *   crossorigin="anonymous">
 * </script>
 * <!-- END Disable Scroll -->
 *
 * ------------------ HOW TO USE ------------------
 * Step 1: Add the script to Webflow
 * - Go to: Page Settings → Before </body> tag section.
 * - Paste the script or include it with the <script> tag above.
 *
 * Step 2: Apply Custom Attributes
 * - Add the attribute `nw-stop-scroll` to any clickable element (e.g., button, link, icon).
 * - Clicking that element will toggle page scrolling on/off.
 *
 * Example:
 * <button nw-stop-scroll>Toggle Scroll</button>
 *
 * Step 3: Publish & Test
 * - Test on staging first to confirm correct scroll-locking behavior.
 * - Publish to live once verified.
 *
 * ------------------ NOTES ------------------
 * - When scrolling is disabled, the `body` element will have `overflow: hidden`.
 * - When re-enabled, the `body` element will revert to `overflow: visible`.
 * - Useful for opening modals, navigation drawers, or other overlays.
 */

/**
 * All clickable elements with the [nw-stop-scroll] attribute.
 * @type {NodeListOf<HTMLElement>}
 */
const stopScrollEls = document.querySelectorAll("[nw-stop-scroll]");

/**
 * Tracks whether scrolling is currently disabled.
 * @type {boolean}
 */
let isScrollingStopped = false;

/**
 * Attaches click handlers to toggle scrolling behavior on the <body>.
 */
stopScrollEls.forEach((stopScrollEl) => {
  stopScrollEl.addEventListener("click", () => {
    const bodyEl = document.querySelector("body");

    if (isScrollingStopped) {
      bodyEl.style.overflow = "visible"; // Re-enable scrolling
    } else {
      bodyEl.style.overflow = "hidden"; // Disable scrolling
    }

    isScrollingStopped = !isScrollingStopped; // Flip toggle state
  });
});
