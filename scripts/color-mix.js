/*! ------------------ ADDING THE SCRIPT: ------------------ 

<!-- START Color Mix  -->

<script
defer src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/color-mix.js"
type="text/javascript" 
referrerpolicy="no-referrer" 
crossorigin="anonymous" 
>
</script>

<!-- END Color Mix  -->
*/

/**
 * Polyfill for CSS `color-mix(in srgb, ...)` fallbacks.
 * 
 * - If the browser supports `color-mix()`, the script does nothing.
 * - If not (e.g., Firefox without flag), it scans all CSS custom properties
 *   whose names start with `--Shades...` and replaces any `color-mix(...)`
 *   value with a computed hex fallback.
 *
 * Usage:
 *   1. Define your shade variables in CSS using `color-mix(...)`.
 *   2. Add this script in Webflow (Footer custom code).
 *   3. On unsupported browsers, variables like `--Shades Green D200`
 *      will be rewritten to a static hex color.
 */
(function () {
  // ---------------------------------------------------------------------------
  // Support detection
  // ---------------------------------------------------------------------------
  var supports = CSS && CSS.supports && CSS.supports('color', 'color-mix(in srgb, black 50%, white 50%)');
  if (supports) return; // Modern browsers: do nothing

  const root = document.documentElement;

  // ---------------------------------------------------------------------------
  // Utility functions
  // ---------------------------------------------------------------------------

  /**
   * Get the current value of a CSS custom property.
   * @param {string} name - Variable name, e.g. "--Shades Green D200"
   * @returns {string} The resolved value (may be `color-mix(...)`).
   */
  function getVar(name) { return getComputedStyle(root).getPropertyValue(name).trim(); }

  /**
   * Set a CSS custom property to a new value.
   * @param {string} name - Variable name, e.g. "--Shades Green D200"
   * @param {string} value - New CSS value (e.g. "#1a2b3c")
   */
  function setVar(name, value) { root.style.setProperty(name, value); }

  /**
   * Parse a CSS color string into RGBA.
   * Supports hex, rgb/rgba, black, white, and nested var() references.
   * @param {string} str
   * @returns {{r:number,g:number,b:number,a:number}|null}
   */
  function parseColor(str) {
    str = str.trim();

    // Handle var(--foo)
    const varMatch = str.match(/^var\((--[A-Za-z0-9_\- ]+)\)\s*$/);
    if (varMatch) return parseColor(getVar(varMatch[1]) || '');

    // #RRGGBB
    const hex6 = str.match(/^#([0-9a-f]{6})$/i);
    if (hex6) return { r:parseInt(hex6[1].slice(0,2),16), g:parseInt(hex6[1].slice(2,4),16), b:parseInt(hex6[1].slice(4,6),16), a:1 };

    // #RGB
    const hex3 = str.match(/^#([0-9a-f]{3})$/i);
    if (hex3) return { r:parseInt(hex3[1][0]+hex3[1][0],16), g:parseInt(hex3[1][1]+hex3[1][1],16), b:parseInt(hex3[1][2]+hex3[1][2],16), a:1 };

    // rgb()/rgba()
    const rgb = str.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
    if (rgb) return {
      r: Math.max(0, Math.min(255, +rgb[1])),
      g: Math.max(0, Math.min(255, +rgb[2])),
      b: Math.max(0, Math.min(255, +rgb[3])),
      a: rgb[4] != null ? Math.max(0, Math.min(1, +rgb[4])) : 1
    };

    // Named colors
    const name = str.toLowerCase();
    if (name === 'black') return { r:0,g:0,b:0,a:1 };
    if (name === 'white') return { r:255,g:255,b:255,a:1 };

    return null;
  }

  /** Clamp number to byte (0–255). */
  function clampByte(v){ return Math.round(Math.max(0, Math.min(255, v))); }

  /**
   * Convert RGBA to hex string.
   * @param {{r:number,g:number,b:number,a:number}} c
   * @returns {string} Hex color, e.g. "#aabbcc"
   */
  function toHex(c){
    const r = clampByte(c.r).toString(16).padStart(2,'0');
    const g = clampByte(c.g).toString(16).padStart(2,'0');
    const b = clampByte(c.b).toString(16).padStart(2,'0');
    return '#' + r + g + b;
  }

  /**
   * Mix two colors in sRGB space (matches `color-mix(in srgb, …)`).
   * @param {object} c1 - First color
   * @param {object} c2 - Second color
   * @param {number} w1 - Weight [0–1]
   * @param {number} w2 - Weight [0–1]
   * @returns {object} Mixed color
   */
  function mixSRGB(c1, c2, w1, w2){
    const sum = w1 + w2 || 1;
    w1 /= sum; w2 /= sum;
    return { r: c1.r*w1 + c2.r*w2, g: c1.g*w1 + c2.g*w2, b: c1.b*w1 + c2.b*w2, a: c1.a*w1 + c2.a*w2 };
  }

  /**
   * Parse a color-mix expression into its components.
   * Only supports `in srgb`.
   * @param {string} expr
   * @returns {{c1:object,c2:object,w1:number,w2:number}|null}
   */
  function parseColorMix(expr) {
    const m = expr.match(/^color-mix\(\s*in\s+([a-z-]+)\s*,\s*(.+)\s*\)$/i);
    if (!m || m[1].toLowerCase() !== 'srgb') return null;

    // Split by top-level comma
    const inner = m[2];
    const parts = [];
    let depth = 0, start = 0;
    for (let i=0; i<inner.length; i++){
      const ch = inner[i];
      if (ch === '(') depth++;
      else if (ch === ')') depth = Math.max(0, depth-1);
      else if (ch === ',' && depth === 0){ parts.push(inner.slice(start, i)); start = i+1; }
    }
    parts.push(inner.slice(start));
    if (parts.length !== 2) return null;

    function splitColorAndPercent(s) {
      const pm = s.trim().match(/^(.*?)(?:\s+([\d.]+)%)?\s*$/);
      return pm ? { colorStr: pm[1].trim(), percent: pm[2] ? parseFloat(pm[2]) : null } : null;
    }

    const a = splitColorAndPercent(parts[0]);
    const b = splitColorAndPercent(parts[1]);
    if (!a || !b) return null;

    const c1 = parseColor(a.colorStr);
    const c2 = parseColor(b.colorStr);
    if (!c1 || !c2) return null;

    let p1 = a.percent != null ? a.percent : (b.percent != null ? 100 - b.percent : 50);
    let p2 = b.percent != null ? b.percent : (100 - p1);

    return { c1, c2, w1: p1/100, w2: p2/100 };
  }

  /**
   * Compute and set fallback for a single variable.
   * @param {string} varName - CSS variable name (e.g. "--Shades Green D200")
   * @returns {boolean} True if processed, false otherwise
   */
  function computeFallback(varName){
    const raw = getVar(varName);
    if (!raw || !/^color-mix\(/i.test(raw)) return false;

    const parsed = parseColorMix(raw);
    if (!parsed) return false;

    const mixed = mixSRGB(parsed.c1, parsed.c2, parsed.w1, parsed.w2);
    setVar(varName, toHex(mixed));
    return true;
  }

  // ---------------------------------------------------------------------------
  // Auto-scan all "--Shades..." variables and compute fallbacks
  // ---------------------------------------------------------------------------
  const styles = getComputedStyle(root);
  const toFix = [];

  for (let i = 0; i < styles.length; i++) {
    const name = styles[i];
    if (!name || !name.startsWith('--')) continue;

    const norm = name.slice(2).toLowerCase().replace(/\s+/g, '-');
    if (!norm.startsWith('shades')) continue;

    const val = styles.getPropertyValue(name).trim();
    if (/^color-mix\(/i.test(val)) toFix.push(name);
  }

  toFix.forEach(computeFallback);
})();


