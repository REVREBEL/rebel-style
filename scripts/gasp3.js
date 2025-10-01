<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script>
(window.Webflow ||= []).push(() => {
  const $ = (sel) => document.querySelector(`[${sel}]`);
  const $$ = (sel) => document.querySelectorAll(`[${sel}]`);

  // Elements
  const navWrap   = $('[watch=page-nav]');
  const tgtMenu   = $('[target=page-nav_menu]');
  const tgtText   = $('[target=page-nav_menu-text]');
  const tgtIcon   = $('[target=page-nav_menu-icon]');
  const tgtLine   = $('[target=page-nav_menu-line]');
  const tgtCircle = $('[target=page-nav_bg-circle]');
  const btn       = $('[button=page-nav_menu]');
  const header    = $('[watch=nav-bar]') || navWrap;

  let clickCount = 0;

  // Helpers
  const show = (el) => el && gsap.to(el, { autoAlpha: 1, duration: 0.2 });
  const hide = (el) => el && gsap.to(el, { autoAlpha: 0, duration: 0.2 });
  const isOpen = () => header?.classList.contains("w--open"); // adjust if you use aria-expanded

  // --- Rule 3: On load hide the button
  hide(btn);

  // --- Rule 4: Show/hide button based on navbar in/out viewport
  if (header && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      if (!entries[0]) return;
      entries[0].isIntersecting ? hide(btn) : show(btn);
    });
    io.observe(header);
  }

  // --- Rules 1 & 2: Handle open/close states
  const handleNavChange = (open, source) => {
    if (open) {
      // Rule 1
      show(tgtIcon);
      hide(tgtText);
    } else {
      // Rule 2
      hide(tgtIcon);
      show(tgtText);
    }
  };

  btn?.addEventListener("click", () => {
    clickCount++;
    handleNavChange(isOpen(), "trigger");
  });

  // --- Rule 5: Hover effects
  const colors = {
    teal: "#71c9c5",
    saffron: "#faca78",
    navy: "#163666",
    blueGray: "#B2D3dE"
  };

  const hoverInClosed = () => {
    if (isOpen()) return;
    gsap.to(tgtText, { color: colors.teal });
    gsap.to(tgtLine, { height: 10, backgroundColor: colors.saffron });
    gsap.to(tgtCircle, { opacity: 1, backgroundColor: colors.navy });
  };
  const hoverOutClosed = () => {
    if (isOpen()) return;
    gsap.to(tgtText, { color: colors.navy });
    gsap.to(tgtLine, { height: 40, backgroundColor: colors.blueGray });
    gsap.to(tgtCircle, { opacity: 0.1, backgroundColor: colors.blueGray });
  };

  const hoverInOpen = () => {
    if (!isOpen()) return;
    gsap.to(tgtIcon, { rotate: 180 });
    gsap.to(tgtLine, { height: 10, backgroundColor: colors.saffron });
    gsap.to(tgtCircle, { opacity: 1, backgroundColor: colors.navy });
  };
  const hoverOutOpen = () => {
    if (!isOpen()) return;
    gsap.to(tgtIcon, { rotate: -180 });
    gsap.to(tgtLine, { height: 40, backgroundColor: colors.blueGray });
    gsap.to(tgtCircle, { opacity: 0.1, backgroundColor: colors.blueGray });
  };

  btn?.addEventListener("mouseenter", () =>
    isOpen() ? hoverInOpen() : hoverInClosed()
  );
  btn?.addEventListener("mouseleave", () =>
    isOpen() ? hoverOutOpen() : hoverOutClosed()
  );

  // Initial state
  if (isOpen()) {
    show(tgtIcon);
    hide(tgtText);
  } else {
    hide(tgtIcon);
    show(tgtText);
  }
});
</script>
