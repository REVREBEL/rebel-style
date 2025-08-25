/*! ------------------ ADDING THE SCRIPT: ------------------ 

<!-- START Calculate Read Time -->
<script
  defer
  src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/share-icons-visibility.js"
  type="text/javascript"
  referrerpolicy="no-referrer"
  crossorigin="anonymous">
</script>
<!-- END Calculate Read Time -->

*/


/**
 * Component: Share Icons Visibility via Scroll Markers
 *
 * Toggles `is-visible` on the wrapper (`aside.share-icons-wrapper`) when the
 * viewport "anchor line" (a fraction of the viewport height) lies between two
 * marker elements: `[data-share-start]` and `[data-share-end]`.
 *
 * Behavior:
 * - Computes absolute positions of start/end markers (with optional px offsets)
 * - Defines an anchor line at `ANCHOR * viewportHeight` from the top
 * - When the page scroll position + anchor falls within [start, end], the wrapper
 *   becomes visible (adds `is-visible`, sets `opacity:1`, enables pointer events)
 * - Debounced via rAF on scroll/resize; also observes reflows
 * - Exposes runtime tuning helpers on `window`:
 *    - `revShareMarkSet({anchor?, startOffset?, endOffset?})`
 *    - `revShareForceAlways(boolean)`
 *
 * Debug:
 * - Set `window.REV_SHARE_DEBUG = true` to enable console logging.
 *
 * Markup requirements:
 * - Wrapper element:  `aside.share-icons-wrapper`
 * - Start sentinel:   any element with `[data-share-start]`
 * - End sentinel:     any element with `[data-share-end]`
 */

(function(){
  if (window.__revShareMarkersInit) return; 
  window.__revShareMarkersInit = true;

  /** @type {string} */
  var WRAPPER_SEL = 'aside.share-icons-wrapper';
  /** @type {string} */
  var START_SEL   = '[data-share-start]';
  /** @type {string} */
  var END_SEL     = '[data-share-end]';

  // ---------------- Tunables (mutable at runtime via revShareMarkSet) ----------------

  /**
   * Viewport fraction for the anchor line. 0 = top, 1 = bottom.
   * @type {number}
   */
  var ANCHOR       = 0.5;

  /**
   * Pixels to shift the start boundary (positive pushes downward).
   * @type {number}
   */
  var START_OFFSET = 0;

  /**
   * Pixels to shift the end boundary (positive pushes downward).
   * @type {number}
   */
  var END_OFFSET   = 0;

  // ---------------- Internals ----------------

  /**
   * Conditional logger (enabled by `window.REV_SHARE_DEBUG = true`).
   * @param {...any} args
   * @returns {void}
   */
  function log(){ 
    if(!window.REV_SHARE_DEBUG) return; 
    try{ 
      console.log.apply(console, ['[revShare markers]'].concat([].slice.call(arguments))); 
    }catch(_){} 
  }

  /**
   * Run a function when DOM is ready.
   * @param {() => void} fn
   */
  function ready(fn){ 
    if(document.readyState !== 'loading') fn(); 
    else document.addEventListener('DOMContentLoaded', fn, {once:true}); 
  }

  ready(function(){
    /** @type {HTMLElement|null} */
    var wrapper = /** @type {HTMLElement|null} */ (document.querySelector(WRAPPER_SEL));
    /** @type {HTMLElement|null} */
    var startEl = /** @type {HTMLElement|null} */ (document.querySelector(START_SEL));
    /** @type {HTMLElement|null} */
    var endEl   = /** @type {HTMLElement|null} */ (document.querySelector(END_SEL));

    if (!wrapper){ log('wrapper not found'); return; }
    if (!startEl || !endEl){ log('markers missing (need both data-share-start and data-share-end)'); return; }

    // Make visible immediately so user sees it while first compute resolves
    assertVisible(wrapper);

    var ticking = false; 
    /** @type {boolean|null} */
    var lastOn = null;

    /**
     * Get absolute top (document space) for an element.
     * @param {Element} el
     * @returns {number}
     */
    function getAbsTop(el){ 
      var r = el.getBoundingClientRect(); 
      return (window.scrollY || window.pageYOffset || 0) + r.top; 
    }

    /**
     * Core computation: determine whether the anchor line lies between start/end.
     * Applies/removes visibility styling accordingly and memoizes state.
     * @returns {void}
     */
    function compute(){
      // Absolute positions with offsets
      var sTop = getAbsTop(startEl) + START_OFFSET;
      var eTop = getAbsTop(endEl)   + END_OFFSET;
      if (eTop < sTop){ var tmp = sTop; sTop = eTop; eTop = tmp; }

      var vh = window.innerHeight || document.documentElement.clientHeight || 0;
      var anchorY = (window.scrollY || window.pageYOffset || 0) + (vh * ANCHOR);

      var on = (anchorY >= sTop) && (anchorY <= eTop);
      if (on !== lastOn){
        wrapper.classList.toggle('is-visible', on);
        if (on){ wrapper.style.opacity='1'; wrapper.style.pointerEvents='auto'; }
        else   { wrapper.style.opacity='';  wrapper.style.pointerEvents=''; }
        lastOn = on; 
        log('active=', on, 'anchorY=', anchorY, 'start=', sTop, 'end=', eTop);
      }
    }

    /**
     * rAF-scheduled compute to throttle scroll/resize.
     * @returns {void}
     */
    function update(){ 
      if (ticking) return; 
      ticking = true; 
      window.requestAnimationFrame(function(){ compute(); ticking = false; }); 
    }

    // Listen to scroll/resize
    window.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update, {passive:true});

    // Recompute if content reflows (images, rich text, layout changes)
    if (typeof ResizeObserver !== 'undefined'){
      try{
        var ro = new ResizeObserver(function(){ update(); });
        ro.observe(document.body);
      }catch(_){ }
    }

    // Initial and follow-up runs (handle late layout shifts)
    update(); 
    setTimeout(update, 300); 
    setTimeout(update, 1200);

    // ---------------- Public Runtime Controls ----------------

    /**
     * Adjust runtime parameters and recompute.
     * @param {{anchor?:number, startOffset?:number, endOffset?:number}} [opts]
     * @returns {{anchor:number, startOffset:number, endOffset:number}} New values.
     */
    window.revShareMarkSet = function(opts){
      opts = opts || {}; 
      var changed=false;
      if (typeof opts.anchor === 'number'){ ANCHOR = Math.max(0, Math.min(1, opts.anchor)); changed=true; }
      if (typeof opts.startOffset === 'number'){ START_OFFSET = opts.startOffset|0; changed=true; }
      if (typeof opts.endOffset === 'number'){ END_OFFSET = opts.endOffset|0; changed=true; }
      if (changed) update();
      return { anchor: ANCHOR, startOffset: START_OFFSET, endOffset: END_OFFSET };
    };

    /**
     * Force the wrapper to always be visible (true) or revert to auto (false).
     * @param {boolean} on
     * @returns {void}
     */
    window.revShareForceAlways = function(on){
      on = !!on; 
      wrapper.classList.toggle('is-visible', on);
      if (on){ wrapper.style.opacity='1'; wrapper.style.pointerEvents='auto'; }
      else   { wrapper.style.opacity='';  wrapper.style.pointerEvents=''; }
      log('force always ->', on);
    };

    /**
     * Immediately make an element visible with expected inline styles.
     * @param {HTMLElement} el
     * @returns {void}
     */
    function assertVisible(el){ 
      el.classList.add('is-visible'); 
      el.style.opacity='1'; 
      el.style.pointerEvents='auto'; 
    }
  });
})();
