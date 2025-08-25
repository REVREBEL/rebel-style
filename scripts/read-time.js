/*! ------------------ ADDING THE SCRIPT: ------------------ 

<!-- START Calculate Read Time -->
<script
  defer
  src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/read-time.js"
  type="text/javascript"
  referrerpolicy="no-referrer"
  crossorigin="anonymous">
</script>
<!-- END Calculate Read Time -->

*/


/*! ------------------ HOW TO USE IN WEBFLOW --------------- 
<!-- Display -->
<div class="readtime-chip" ct-readtime-element="time"
     data-wpm="220"
     data-diminish-images="true"
     data-suffix="min read"
     data-min-label="<1 min read">
  <!-- Optional server-side default for no-JS environments -->
  {{wf {"path":"publish-date","transformers":[{"name":"date","arguments":["MMM DD, YYYY"]}],"type":"Date"} }}
</div>

<!-- Article body -->
<div class="w-richtext" ct-readtime-element="target">
  <!-- Webflow CMS Rich Text here -->
</div>

*/


/*! REVREBEL Read Time (Webflow CMS)
 *  Usage:
 *  - Mark your article rich text: [ct-readtime-element="target"]
 *  - Mark your display node:     [ct-readtime-element="time"]
 *  Optional attributes (on either the target or time element):
 *    data-wpm="200"                     // words per minute
 *    data-image-seconds="12"            // seconds per image (fallback mode)
 *    data-diminish-images="true"        // use diminishing returns model (12s,11s,...min 3s)
 *    data-min-label="<1 min read"       // label for sub-minute
 *    data-suffix="min read"             // label suffix
 */

/**
 * Component: Read Time (ct-readtime)
 *
 * Calculates and renders an estimated reading time into an element marked
 * with `[ct-readtime-element="time"]`, based on the visible text within a
 * target container `[ct-readtime-element="target"]`. Also accounts for images
 * using a configurable per-image time with optional diminishing weights.
 *
 * Markup (example):
 * <div ct-readtime-element="target">
 *   <!-- article content -->
 * </div>
 * <span
 *   ct-readtime-element="time"
 *   data-wpm="220"
 *   data-image-seconds="12"
 *   data-diminish-images="true"
 *   data-min-label="<1 min read"
 *   data-suffix="min read"
 * ></span>
 *
 * Data Attributes (read from `[ct-readtime-element="time"]` first, then target):
 * - data-wpm {number}                : Words per minute (default 200; min used in calc is 60)
 * - data-image-seconds {number}      : Seconds to add per image (default 12)
 * - data-diminish-images {"true"|"false"} : If true, image seconds diminish (12→11→10… min 3)
 * - data-min-label {string}          : Label when result < 1 minute (default "<1 min read")
 * - data-suffix {string}             : Suffix appended to minutes (default "min read")
 *
 * Public API:
 * - window.RevReadTime.recompute(): Force a re-computation and re-render.
 *
 * Behavior:
 * - Runs on DOMContentLoaded (or immediately if DOM is ready)
 * - Observes the target for DOM changes (tabs, filters, lazy content, CMS pagination)
 * - Recomputes when images within the target finish loading
 */

(function () {
  "use strict";

  /* ---------------------- Tiny Helpers ---------------------- */

  /**
   * querySelector shorthand.
   * @param {string} sel - CSS selector.
   * @param {ParentNode} [root=document] - Root to search in.
   * @returns {Element|null}
   */
  const $ = (sel, root = document) => root.querySelector(sel);

  /**
   * Set textContent on a node and return the text.
   * @param {string} s - Text to set.
   * @param {Node} n - Target node.
   * @returns {string} The same text `s`.
   */
  const text = (s, n) => (n.textContent = s, s);

  /**
   * Parse an integer or fall back.
   * @param {unknown} v - Value to parse.
   * @param {number} d - Default if NaN / non-finite.
   * @returns {number}
   */
  const toInt = (v, d) => {
    const n = parseInt(String(v), 10);
    return Number.isFinite(n) ? n : d;
  };

  /**
   * Create a debounced function wrapper.
   * @param {Function} fn - Function to debounce.
   * @param {number} ms - Delay in milliseconds.
   * @returns {Function} Debounced function.
   */
  function debounce(fn, ms) {
    let t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, ms);
    };
  }

  /* ---------------------- Text & Image Analysis ---------------------- */

  /**
   * Extract visible text from a root element, skipping SCRIPT/STYLE/NOSCRIPT
   * and whitespace-only text nodes.
   * @param {Element|Document} root - Root element to extract from.
   * @returns {string} Visible text content.
   */
  function getVisibleText(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        // ignore whitespace-only
        return /\S/.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    let out = "";
    let n;
    while ((n = walker.nextNode())) {
      const p = n.parentElement;
      if (!p) continue;
      const tn = p.tagName;
      if (tn === "SCRIPT" || tn === "STYLE" || tn === "NOSCRIPT") continue;
      out += " " + n.nodeValue;
    }
    return out.trim();
  }

  /**
   * Count words by splitting on whitespace.
   * @param {string} str - Input text.
   * @returns {number} Word count (0 if empty).
   */
  function countWords(str) {
    if (!str) return 0;
    return (str.trim().match(/\S+/g) || []).length;
  }

  /**
   * Compute total seconds contributed by images within `target`.
   * If `diminish` is true, applies a diminishing schedule starting at `perImage`
   * seconds for the first image and decreasing by 1 second per image to a floor of 3s.
   *
   * @param {Element} target - Container whose descendant images are considered.
   * @param {number} [perImage=12] - Seconds per image (flat or starting value).
   * @param {boolean} [diminish=true] - Whether to diminish per-image seconds.
   * @returns {number} Total seconds from images.
   */
  function imageSeconds(target, perImage = 12, diminish = true) {
    /** @type {NodeListOf<HTMLImageElement>} */
    const imgs = target.querySelectorAll("img");
    const n = imgs.length;
    if (!n) return 0;
    if (!diminish) return n * perImage;

    // Diminishing: e.g., 12s first, then -1s each until minimum 3s
    let total = 0;
    let sec = perImage;
    for (let i = 0; i < n; i++) {
      total += Math.max(3, sec);
      sec -= 1;
    }
    return total;
  }

  /* ---------------------- Core Compute & Render ---------------------- */

  /**
   * Compute read time from target content and render into the time element.
   * Reads configuration from data attributes (time element first, then target).
   * Marks the time element with `data-readtime-ready="true"` on completion.
   *
   * @returns {void}
   */
  function computeAndRender() {
    /** @type {Element|null} */
    const target = $('[ct-readtime-element="target"]');
    /** @type {Element|null} */
    const timeEl = $('[ct-readtime-element="time"]');

    if (!target || !timeEl) return; // quietly exit if not present

    // Config: prefer attrs on timeEl, then target, then defaults
    const cfgFrom = (attr, fallback) =>
      timeEl.getAttribute(attr) ?? target.getAttribute(attr) ?? fallback;

    const wpm = toInt(cfgFrom("data-wpm", 200), 200);
    const perImg = toInt(cfgFrom("data-image-seconds", 12), 12);
    const diminish = String(cfgFrom("data-diminish-images", "true")).toLowerCase() === "true";
    const minLabel = cfgFrom("data-min-label", "<1 min read");
    const suffix = cfgFrom("data-suffix", "min read");

    const txt = getVisibleText(target);
    const words = countWords(txt);

    // Seconds from words (guard WPM with a low bound of 60)
    const secFromWords = words > 0 ? (words / Math.max(60, wpm)) * 60 : 0;

    // Seconds from images
    const secFromImages = imageSeconds(target, perImg, diminish);

    const totalSeconds = Math.round(secFromWords + secFromImages);
    const minutes = Math.ceil(totalSeconds / 60);

    if (minutes < 1) {
      text(minLabel, timeEl);
    } else if (minutes === 1) {
      text(`1 ${suffix}`, timeEl);
    } else {
      text(`${minutes} ${suffix}`, timeEl);
    }

    // Mark as ready for styling hooks
    timeEl.setAttribute("data-readtime-ready", "true");
  }

  /* ---------------------- Boot & Observe ---------------------- */

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", computeAndRender);
  } else {
    computeAndRender();
  }

  /**
   * Observe content changes within the target to recompute read time:
   * - childList / subtree mutations (tabs, filters, CMS pagination, etc.)
   * - image load events (lazy-loaded images)
   * @returns {void}
   */
  const observe = () => {
    /** @type {Element|null} */
    const target = $('[ct-readtime-element="target"]');
    if (!target) return;

    const refire = debounce(computeAndRender, 120);

    const mo = new MutationObserver(refire);
    mo.observe(target, { childList: true, subtree: true, characterData: true });

    // Recalculate when images load
    target.querySelectorAll("img").forEach(img => {
      if (!img.complete) img.addEventListener("load", refire, { once: true });
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observe);
  } else {
    observe();
  }

  /**
   * Public API: manual trigger to recompute.
   * @type {{ recompute: () => void }}
   */
  window.RevReadTime = { recompute: computeAndRender };
})();
