
/**
<!-- GSAP -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
 */

/**
<!-- START PageNav GSAP Controller  -->
<script
defer src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/page-nav-gsap-controller.js"
type="text/javascript" 
referrerpolicy="no-referrer" 
crossorigin="anonymous" 
>
</script>
<!-- END PageNav GSAP Controller  -->
 */

/**
 * GSAP controller wired to your data-attributes.
 * Rules covered:
 *  1/2) Swap icon/text when [data-watch="page-nav"] opens/closes,
 *       distinguishing first/second click on [data-trigger="page-nav_menu"]
 *       vs "not from click" (observer-driven changes).
 *  3) Hide [data-target="page-nav_menu"] on page load.
 *  4) Hide the side trigger while [data-watch="nav-bar"] is in-viewport OR
 *     while the header nav (data-trigger="page-nav-btn") is open; otherwise show it.
 *  5) Hover effects on the side trigger, with different behavior when side nav is open vs closed.
 */
(window.Webflow ||= []).push(() => {
  // ---------- Shortcuts ----------
  const q  = (sel) => document.querySelector(sel);
  const qa = (sel) => Array.from(document.querySelectorAll(sel));
  const byAttr = (name, value) => `[data-${name}="${value}"]`;

  // ---------- Elements (exact names you provided) ----------
  const sideNavWrap   = q(byAttr('watch', 'page-nav'));       // side/full-page nav wrapper
  const headerWatchEl = q(byAttr('watch', 'nav-bar'));        // header section to observe
  const headerBtn     = q(byAttr('trigger', 'page-nav-btn')); // native Webflow header nav button
  const sideTrigger   = q(byAttr('trigger', 'page-nav_menu')); // custom side nav trigger (lives under header)
  const tgtMenu       = q(byAttr('target',  'page-nav_menu')); // element to show/hide as the "button"
  const tgtText       = q(byAttr('target',  'page-nav_menu-text'));
  const tgtIcon       = q(byAttr('target',  'page-nav_menu-icon'));
  const tgtLine       = q(byAttr('target',  'page-nav_menu-line'));
  const tgtCircle     = q(byAttr('target',  'page-nav_bg-circle'));

  if (!sideNavWrap) return; // must have the side nav wrapper

  // ---------- GSAP helpers ----------
  const show = (el, dur=0.2) => el && gsap.to(el, { autoAlpha: 1, duration: dur, overwrite: 'auto' });
  const hide = (el, dur=0.2) => el && gsap.to(el, { autoAlpha: 0, duration: dur, overwrite: 'auto' });

  const C = {
    teal:     '#71c9c5',
    saffron:  '#faca78',
    navy:     '#163666',
    blueGray: '#B2D3dE'
  };

  // ---------- State ----------
  let clickCount = 0;              // counts clicks on the *side* trigger
  let lastSource = 'init';         // 'triggerClick' | 'observer' | 'init'
  let headerInView = true;         // updated by IntersectionObserver

  // Side nav open/close detection:
  // We support multiple conventions to be resilient: aria-expanded, data-open/state, or open classes.
  const isSideNavOpen = () => {
    // aria-expanded on the side nav wrapper or on the side trigger (if you set it there)
    const ariaSide = sideNavWrap.getAttribute('aria-expanded');
    if (ariaSide === 'true' || ariaSide === 'false') return ariaSide === 'true';
    if (sideTrigger) {
      const ariaTrig = sideTrigger.getAttribute('aria-expanded');
      if (ariaTrig === 'true' || ariaTrig === 'false') return ariaTrig === 'true';
    }
    // data attributes often used to track state
    if (sideNavWrap.getAttribute('data-open') === 'true') return true;
    if (sideNavWrap.getAttribute('data-state') === 'open') return true;

    // class-based fallback (e.g., .is-open or .w--open on the wrapper)
    return sideNavWrap.classList.contains('is-open') || sideNavWrap.classList.contains('w--open') || document.body.classList.contains('page-nav--open');
  };

  // Header nav open detection via native button aria-expanded
  const isHeaderNavOpen = () => {
    if (!headerBtn) return false;
    const aria = headerBtn.getAttribute('aria-expanded');
    return aria === 'true';
  };

  // ---------- Rule 1 & 2 handler ----------
  const applyOpenVisuals  = () => { show(tgtIcon); hide(tgtText); };
  const applyCloseVisuals = () => { hide(tgtIcon); show(tgtText); };

  const handleSideNavChange = (source) => {
    lastSource = source;
    const open = isSideNavOpen();

    // Your logic:
    //  - OPEN case: (open && source !== 'triggerClick') OR first click on sideTrigger
    //  - CLOSE case: (!open && source !== 'triggerClick') OR second click on sideTrigger
    const isFirstClick  = (source === 'triggerClick' && (clickCount % 2) === 1);
    const isSecondClick = (source === 'triggerClick' && (clickCount % 2) === 0 && clickCount > 0);
    const notFromClick  = (source !== 'triggerClick');

    const shouldApplyOpen  = (open && notFromClick) || isFirstClick;
    const shouldApplyClose = (!open && notFromClick) || isSecondClick;

    if (shouldApplyOpen)  applyOpenVisuals();
    if (shouldApplyClose) applyCloseVisuals();
  };

  // ---------- Rule 3: Hide the side trigger button on page load ----------
  hide(tgtMenu);

  // ---------- Rule 4: Show/hide side trigger based on header visibility and header nav state ----------
  const updateSideTriggerVisibility = () => {
    // Hide if:
    //  - header section is in view (sticky hero/header zone), OR
    //  - header nav is currently open
    // Otherwise show.
    if (headerInView || isHeaderNavOpen()) {
      hide(tgtMenu);
    } else {
      show(tgtMenu);
    }
  };

  // Observe header section in/out of viewport
  if (headerWatchEl && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      const e = entries[0];
      if (!e) return;
      headerInView = e.isIntersecting;
      updateSideTriggerVisibility();
    }, { root: null, threshold: 0.01 });
    io.observe(headerWatchEl);
  } else {
    // If no header watcher, default to "out of view" so the button can show when allowed
    headerInView = false;
    updateSideTriggerVisibility();
  }

  // Watch header nav open/close via aria-expanded on the native button
  if (headerBtn) {
    const moHeader = new MutationObserver(updateSideTriggerVisibility);
    moHeader.observe(headerBtn, { attributes: true, attributeFilter: ['aria-expanded'] });
  }

const hoverOutClosed = () => {
    if (isSideNavOpen()) return;
    if (tgtText)   gsap.to(tgtText,   { color: C.navy, duration: 0.2, overwrite: 'auto' });
    if (tgtLine)   gsap.to(tgtLine,   { height: 40, backgroundColor: C.blueGray, duration: 0.25, overwrite: 'auto' });
    if (tgtCircle) gsap.to(tgtCircle, { opacity: 0.1, backgroundColor: C.blueGray, duration: 0.25, overwrite: 'auto' });
  };

  const hoverInOpen = () => {
    if (!isSideNavOpen()) return; // only when side nav is open
    if (tgtIcon)   gsap.to(tgtIcon,   { rotate: 180, duration: 0.25, overwrite: 'auto' });
    if (tgtLine)   gsap.to(tgtLine,   { height: 10, backgroundColor: C.saffron, duration: 0.25, overwrite: 'auto' });
    if (tgtCircle) gsap.to(tgtCircle, { opacity: 1, backgroundColor: C.navy, duration: 0.25, overwrite: 'auto' });
  };
  const hoverOutOpen = () => {
    if (!isSideNavOpen()) return;
    if (tgtIcon)   gsap.to(tgtIcon,   { rotate: -180, duration: 0.25, overwrite: 'auto' });
    if (tgtLine)   gsap.to(tgtLine,   { height: 40, backgroundColor: C.blueGray, duration: 0.25, overwrite: 'auto' });
    if (tgtCircle) gsap.to(tgtCircle, { opacity: 0.1, backgroundColor: C.blueGray, duration: 0.25, overwrite: 'auto' });
  };

  // Bind hover to the *visible side trigger element* (tgtMenu)
  if (tgtMenu) {
    tgtMenu.addEventListener('mouseenter', () => (isSideNavOpen() ? hoverInOpen() : hoverInClosed()));
    tgtMenu.addEventListener('mouseleave', () => (isSideNavOpen() ? hoverOutOpen() : hoverOutClosed()));
  }

  // ---------- Click wiring ----------
  // Count first/second click on your custom side trigger
  if (sideTrigger) {
    sideTrigger.addEventListener('click', () => {
      clickCount += 1;
      handleSideNavChange('triggerClick');
    });
  }

  // If the side nav wrapper flips state via attributes/classes (external code), react to it
  const moSide = new MutationObserver(() => handleSideNavChange('observer'));
  moSide.observe(sideNavWrap, {
    attributes: true,
    attributeFilter: ['class', 'aria-expanded', 'data-open', 'data-state']
  });

  // ---------- Initial pass ----------
  // Normalize initial visuals and visibility
  if (isSideNavOpen()) applyOpenVisuals(); else applyCloseVisuals();

  // Set sensible initial styles for animated pieces
  if (tgtText)   gsap.set(tgtText,   { willChange: 'color, opacity' });
  if (tgtLine)   gsap.set(tgtLine,   { height: 40, backgroundColor: C.blueGray, willChange: 'height, background-color' });
  if (tgtCircle) gsap.set(tgtCircle, { opacity: 0.1, backgroundColor: C.blueGray, willChange: 'opacity, background-color' });
  if (tgtIcon)   gsap.set(tgtIcon,   { transformOrigin: '50% 50%' });

  // Ensure the side trigger visibility matches header state immediately
  updateSideTriggerVisibility();
});
