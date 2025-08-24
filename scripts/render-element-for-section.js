
<style>
.share-icons-wrapper{
  position: fixed;
  inset: auto 1rem 20vh auto; /* example placement: bottom-right; tweak */
  opacity: 0;
  pointer-events: none;
  transition: opacity .2s ease;
  z-index: 999; /* make sure it’s above RTE and images */
}
.share-icons-wrapper.is-visible{
  opacity: 1;
  pointer-events: auto;
}
</style>



<script>
(function () {
  // Prevent double-init in Webflow preview
  if (window.__revShareInit) return; 
  window.__revShareInit = true;

  function ready(fn){ 
    if (document.readyState !== 'loading') fn(); 
    else document.addEventListener('DOMContentLoaded', fn, { once: true }); 
  }

  ready(function () {
    // Grab targets – prefer a data hook if you have one
    var wrapper = document.querySelector('.share-icons-wrapper');
    var section = document.querySelector('[data-section="blog-detail"]') || 
                  document.querySelector('.blog-detail');

    if (!wrapper || !section) return;

    // Visibility logic: show when any meaningful part of section is in view
    var MIN_FRACTION = 0.1; // require at least 10% of section or viewport overlap

    function computeVisibleFraction(rect, vh){
      var top = Math.max(0, rect.top);
      var bottom = Math.min(vh, rect.bottom);
      var visible = Math.max(0, bottom - top);
      var basis = Math.min(vh, rect.height || 1);
      return visible / basis;
    }

    function update(){
      var rect = section.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var frac = computeVisibleFraction(rect, vh);
      var onScreen = frac >= MIN_FRACTION;
      wrapper.classList.toggle('is-visible', onScreen);
    }

    // Listen + react to layout changes
    var passiveOpts = { passive: true };
    window.addEventListener('scroll', update, passiveOpts);
    window.addEventListener('resize', update, passiveOpts);

    // Track section size/content changes (images, fonts)
    if ('ResizeObserver' in window){
      var ro = new ResizeObserver(update);
      ro.observe(section);
    }

    // In case Webflow IX manipulates DOM late
    requestAnimationFrame(update);
    setTimeout(update, 300);
    setTimeout(update, 1200);
  });
})();
</script>
