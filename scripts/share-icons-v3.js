
/*! ADD THE SCRIPT INSIDE WEBFLOW:

<!-- START Share Icons Render -->
<script
  defer
  src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/share-icons-v3.js"
  type="text/javascript"
  referrerpolicy="no-referrer"
  crossorigin="anonymous">
</script>

CSS (unchanged). Place globally or per‑page.
CSS baseline: add this in Page Settings <head> or global embed 

*/

/*!
<!-- CSS (unchanged). Place globally or per‑page. -->
<!-- CSS baseline: add this in Page Settings <head> or global embed -->
<style>
.share-icons-wrapper {
position: fixed;
right: 1rem;
bottom: 20vh;
z-index: 9999;
transition: opacity .25s ease;
// default hidden 
opacity: 0;
pointer-events: none;
}
.share-icons-wrapper.is-visible {
opacity: 1;
pointer-events: auto; // clickable 
}
</style>

*/




(function(){
  if (window.__revShareProgressInit) return; window.__revShareProgressInit = true;

  // ======= TUNABLES =======
  // Show while section progress is within [START_PCT, END_PCT]. 0 = section top, 1 = section bottom.
  var START_PCT = 0.05;   // becomes visible ~5% into the section
  var END_PCT   = 0.98;   // hides near the very end of the section

  // Use a little hysteresis so it doesn't flicker at the boundary.
  var HYSTERESIS = 0.02;  // 2% buffer

  // Optional extra pixel margins relative to the section, if needed.
  var EXTRA_TOP_PX    = 0;   // pretend the section starts this many px later
  var EXTRA_BOTTOM_PX = 0;   // pretend the section ends this many px sooner

  // Which elements?
  var WRAPPER_SEL = '.share-icons-wrapper';
  var SECTION_SEL = '[data-section="blog-detail"], .blog-detail';

  // ======= CORE =======
  function ready(fn){ if(document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn, {once:true}); }

  ready(function(){
    var wrapper = document.querySelector(WRAPPER_SEL);
    var section = document.querySelector(SECTION_SEL);
    if (!wrapper || !section) return;

    var ticking = false; var lastOn = null;

    function compute(){
      var r = section.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var scrollY = window.scrollY || window.pageYOffset || 0;

      // Absolute section metrics
      var sectionTopAbs = scrollY + r.top + EXTRA_TOP_PX;
      var sectionHeight = Math.max(1, section.offsetHeight - (EXTRA_TOP_PX + EXTRA_BOTTOM_PX));
      var sectionBottomAbs = sectionTopAbs + sectionHeight;

      // We'll use the viewport MIDPOINT as our probe so tall/short viewports behave predictably
      var viewportMidAbs = scrollY + (vh * 0.5);

      // Progress of viewport midpoint through the section [0..1]
      var progress = (viewportMidAbs - sectionTopAbs) / sectionHeight;

      // Apply hysteresis (Schmitt trigger)
      var on;
      if (lastOn === true) {
        // Once on, allow it to stay on a bit longer past END_PCT
        on = (progress >= START_PCT - HYSTERESIS) && (progress <= END_PCT + HYSTERESIS);
      } else if (lastOn === false) {
        // Once off, require a bit more before turning on
        on = (progress >= START_PCT + HYSTERESIS) && (progress <= END_PCT - HYSTERESIS);
      } else {
        // First run
        on = (progress >= START_PCT) && (progress <= END_PCT);
      }

      // Also force off if viewport midpoint is clearly outside the section (for safety)
      if (viewportMidAbs < sectionTopAbs - 1 || viewportMidAbs > sectionBottomAbs + 1) on = false;

      if (on !== lastOn){
        wrapper.classList.toggle('is-visible', on);
        lastOn = on;
      }
    }

    function update(){ if (ticking) return; ticking = true; window.requestAnimationFrame(function(){ compute(); ticking = false; }); }

    window.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update, {passive:true});

    // Recompute if the section’s height changes (images, webfonts, RTE content)
    if (typeof ResizeObserver !== 'undefined'){
      var ro = new ResizeObserver(function(){ update(); });
      ro.observe(section);
    }

    // Kickoff
    update();
    setTimeout(update, 300);
    setTimeout(update, 1200);

    // Expose quick tuning in console: revShareSet({start,end,topPx,bottomPx,hyst})
    window.revShareSet = function(opts){
      opts = opts || {};
      if (typeof opts.start === 'number') START_PCT = Math.max(0, Math.min(1, opts.start));
      if (typeof opts.end   === 'number') END_PCT   = Math.max(0, Math.min(1, opts.end));
      if (typeof opts.topPx === 'number') EXTRA_TOP_PX = opts.topPx|0;
      if (typeof opts.bottomPx === 'number') EXTRA_BOTTOM_PX = opts.bottomPx|0;
      if (typeof opts.hyst === 'number') HYSTERESIS = Math.max(0, Math.min(0.2, opts.hyst));
      update();
    };
  });
})();
