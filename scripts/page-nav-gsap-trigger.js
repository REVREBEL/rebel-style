/*
 * Simple visibility controller for the floating page-nav trigger.
 * This script uses IntersectionObserver to show/hide the trigger
 * based on the visibility of the main header navigation.
 */
(window.Webflow ||= []).push(() => {
  // --- Elements ---
  // The main header navigation bar to watch.
  const headerNav = document.querySelector('[data-watch="nav-bar"]');
  // The floating button to show/hide.
  // It looks for a trigger attribute first, then falls back to a target attribute.
  const floatingTrigger = document.querySelector('[data-trigger="page-nav_menu"]') || document.querySelector('[data-target="page-nav_menu"]');

  // --- Guards ---
  // If either element is missing, do nothing.
  if (!headerNav || !floatingTrigger) {
    console.warn('Required elements for nav trigger visibility not found. Missing either [data-watch="nav-bar"] or [data-trigger="page-nav_menu"].');
    return;
  }

  // --- Rule 3: On page load, hide the floating trigger ---
  // We set the initial state here. The observer will correct it if the header is already out of view.
  floatingTrigger.style.display = 'none';
  console.log('Floating trigger initially hidden.');

  // --- Rule 4: Show/hide based on header visibility ---
  const handleIntersection = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Header is IN the viewport, so HIDE the floating trigger.
        floatingTrigger.style.display = 'none';
        console.log('Header is in view. Hiding floating trigger.');
      } else {
        // Header is OUT of the viewport, so SHOW the floating trigger.
        // Note: 'block' is a safe default. Change to 'flex' or 'inline-block' if your button is styled that way.
        floatingTrigger.style.display = 'block';
        console.log('Header is out of view. Showing floating trigger.');
      }
    });
  };

  // Create and start the observer.
  // The threshold means the callback will fire as soon as even 1% of the header is visible/hidden.
  const observer = new IntersectionObserver(handleIntersection, {
    root: null, // observes intersections relative to the viewport
    threshold: 0.01,
  });

  observer.observe(headerNav);
});