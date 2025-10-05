<script>
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.navbar'); // adjust selector if needed
  if (!nav) return;

  const LIGHT_INK = '#111'; // dark text for light backgrounds
  const DARK_INK  = '#fff'; // light text for dark backgrounds

  function luminance(rgb) {
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    return 0.299*r + 0.587*g + 0.114*b; // brightness calculation
  }

  function updateNavInk() {
    const sections = document.querySelectorAll('section'); // adjust if your sections use a different selector
    let current = null;

    // find which section is currently behind the navbar
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= nav.offsetHeight && rect.bottom >= 0) {
        current = section;
      }
    });

    if (current) {
      const bg = getComputedStyle(current).backgroundColor;
      const lum = luminance(bg);

      // pick color based on brightness
      const inkColor = lum > 128 ? LIGHT_INK : DARK_INK;

      // apply to all adaptive elements inside navbar
      nav.querySelectorAll('[data-adaptive="true"]').forEach(el => {
        el.style.color = inkColor;

        // optional: also change SVG fills if needed
        if (el.tagName.toLowerCase() === 'svg' || el.querySelector('svg')) {
          el.style.fill = inkColor;
          el.querySelectorAll('path').forEach(path => path.setAttribute('fill', inkColor));
        }
      });
    }
  }

  // run once and then on scroll/resize
  updateNavInk();
  window.addEventListener('scroll', updateNavInk, { passive: true });
  window.addEventListener('resize', updateNavInk);
});
</script>

