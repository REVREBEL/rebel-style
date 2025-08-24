


/*! ADDING THE SCRIPT:

<!-- START Calculate Read Time -->
<script
  defer
  src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/read-time.js"
  type="text/javascript"
  referrerpolicy="no-referrer"
  crossorigin="anonymous">
</script>
<!-- END Calculate Read Time -->


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


(function () {
  "use strict";

  // --- tiny helpers ---
  const $ = (sel, root = document) => root.querySelector(sel);
  const text = (s, n) => (n.textContent = s, s);
  const toInt = (v, d) => {
    const n = parseInt(String(v), 10);
    return Number.isFinite(n) ? n : d;
  };

  // Debounce helper for observers
  function debounce(fn, ms) {
    let t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, ms);
    };
  }

  // Extract readable text (skip script/style/noscript)
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

  // Word count (split on whitespace)
  function countWords(str) {
    if (!str) return 0;
    return (str.trim().match(/\S+/g) || []).length;
  }

  // Image time: either flat seconds per image, or diminishing model (12,11,10... min 3)
  function imageSeconds(target, perImage = 12, diminish = true) {
    const imgs = target.querySelectorAll("img");
    const n = imgs.length;
    if (!n) return 0;
    if (!diminish) return n * perImage;

    // Diminishing: 12s first image, then -1s each until minimum 3s
    let total = 0;
    let sec = perImage;
    for (let i = 0; i < n; i++) {
      total += Math.max(3, sec);
      sec -= 1;
    }
    return total;
  }

  function computeAndRender() {
    const target = $('[ct-readtime-element="target"]');
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

    // Seconds from words
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

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", computeAndRender);
  } else {
    computeAndRender();
  }

  // Recompute if content changes (tabs, filters, lazy‑loaded content, CMS pagination)
  const observe = () => {
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

  // Expose a manual trigger (optional)
  window.RevReadTime = { recompute: computeAndRender };
})();
