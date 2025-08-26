
/*! ------------------ ADDING THE SCRIPT: ------------------ 

<!-- START Dynamic Border Shadow Color  -->
<script
defer src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/dynamic-border-shadow-color.js"
type="text/javascript" 
referrerpolicy="no-referrer" 
crossorigin="anonymous" 
>
</script>
<!-- END Dynamic Border Shadow Color -->

*/

/**
 * Dynamically sets a `--dynamic-border-shadow-color` CSS variable for each `.button`
 * element based on its computed background color or, if transparent,
 * its text color. 
 * 
 * This allows CSS to control when effects (e.g., shadows) are applied
 * while ensuring the effect color always matches the element's actual
 * visual color, including variant styles and dynamically applied classes.
 *
 * @example CSS usage:
 * .button:hover {
 *   box-shadow: 0 20px 30px -15px color-mix(in srgb, var(--dynamic-border-shadow-color) 40%, transparent);
 * }
 */

/**
 * Parses an RGB or RGBA string into an object.
 *
 * @param {string} v - The rgb(...) or rgba(...) color string.
 * @returns {{r:number, g:number, b:number, a:number}|null} Parsed color components or null if parsing fails.
 */
const parseRGB = (v) => {
  const m = String(v).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 1 } : null;
};

/**
 * Converts RGB object to an rgba(...) string.
 *
 * @param {{r:number, g:number, b:number}} color - The RGB color object.
 * @param {number} [a=1] - Alpha value between 0 and 1.
 * @returns {string} An rgba(...) string.
 */
const toRGBA = ({ r, g, b }, a = 1) => `rgba(${r}, ${g}, ${b}, ${a})`;

/**
 * Gets the effective visible color for an element.
 * Prefers background-color; falls back to text color if transparent.
 *
 * @param {HTMLElement} el - The element to inspect.
 * @returns {{r:number, g:number, b:number, a:number}} Color object.
 */
const getEffectiveColor = (el) => {
  const cs = getComputedStyle(el);
  const bg = parseRGB(cs.backgroundColor);
  if (bg && bg.a > 0) return bg;

  // Fallback: text color
  const fg = parseRGB(cs.color);
  if (fg) return fg;

  // Final fallback: neutral gray
  return { r: 0, g: 0, b: 0, a: 0.2 };
};

/**
 * Updates the `--dynamic-border-shadow-color` CSS variable for the given button element.
 *
 * @param {HTMLElement} btn - The button element to update.
 */
const updateButtonColorVar = (btn) => {
  const col = getEffectiveColor(btn);
  btn.style.setProperty('--dynamic-border-shadow-color', toRGBA(col, col.a));
};

/**
 * Observes and updates the `--dynamic-border-shadow-color` CSS variable for a button
 * whenever its class list changes (to handle variant toggles).
 *
 * @param {HTMLElement} btn - The button element to observe.
 */
const wireButton = (btn) => {
  updateButtonColorVar(btn);

  // Update if Webflow toggles variant classes dynamically
  new MutationObserver(() => updateButtonColorVar(btn))
    .observe(btn, { attributes: true, attributeFilter: ['class'] });
};

/**
 * Initializes the script for all `.button` elements.
 */
const init = () => {
  document.querySelectorAll('.button').forEach(wireButton);
};

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
