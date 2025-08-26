/*! ------------------ ADDING THE SCRIPT: ------------------ 

<!-- START Create Blog Summary -->
<script
  defer
  src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/blog-summary.js"
  type="text/javascript"
  referrerpolicy="no-referrer"
  crossorigin="anonymous">
</script>
<!-- END Create Blog Summary -->

*/

/**
 * Generates a summary navigation from article headings (h2, h3, h4)
 * and enables smooth scrolling to target sections.
 *
 * Behavior:
 * - Scans #articleBody for h2, h3, h4 elements
 * - Assigns IDs based on heading text (slugified)
 * - Creates navigation links inside #summary using your existing CSS classes
 *   (.link, .headline-xsmall, .headline-small, .headline-regular)
 * - Smooth scrolls to target section on click
 * - On page load with hash, auto-scrolls to section
 */

function initBlogSummary() {
  /** @type {HTMLElement|null} */
  const list = document.getElementById("summary");

  /** @type {HTMLElement|null} */
  const body = document.getElementById("articleBody");

  /** @type {HTMLElement[]} */
  const sections = body ? Array.from(body.querySelectorAll('h2, h3, h4')) : [];

  sections.forEach(section => {
    /** @type {string} Heading text */
    const title = section.innerText;

    /** @type {string} Slugified ID */
    const id = title.trim()
      .toLowerCase()
      .replace(/\s+/g, '-')        // Replace spaces with dashes
      .replace(/[^\w-]+/g, '');    // Remove non-word characters

    // Assign the generated ID to the section
    section.id = id;

    /** @type {HTMLAnchorElement} Navigation link */
    const link = document.createElement('a');
    link.innerHTML = title;
    link.href = `#${id}`;
    link.classList.add('link'); // Base class for all summary links

    // Add headline class based on heading level
    if (section.nodeName === 'H2') {
      link.classList.add('headline-xsmall');
    } else if (section.nodeName === 'H3') {
      link.classList.add('headline-small');
    } else if (section.nodeName === 'H4') {
      link.classList.add('headline-regular');
    }

    /**
     * Smooth-scroll behavior on link click
     */
    link.addEventListener('click', function (e) {
      e.preventDefault();

      /** @type {string} */
      const decodedHref = decodeURIComponent(this.getAttribute('href') || '');
      /** @type {HTMLElement|null} */
      const targetElement = document.querySelector(decodedHref);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.getBoundingClientRect().top + window.pageYOffset - 20,
          behavior: 'smooth'
        });
      }
    });

    if (list) {
      list.appendChild(link);
    }
  });

  /**
   * If page loads with a hash in the URL,
   * auto-scroll smoothly to the section.
   */
  if (window.location.hash) {
    const hash = decodeURIComponent(window.location.hash);
    const targetElement = document.querySelector(hash);
    if (targetElement) {
      setTimeout(() => {
        window.scrollTo({
          top: targetElement.getBoundingClientRect().top + window.pageYOffset - 20,
          behavior: 'smooth'
        });
      }, 0);
    }
  }
}

// Use 'load' instead of 'DOMContentLoaded' to ensure all content,
// especially from frameworks like Webflow, is fully rendered.
if (document.readyState === 'complete') {
  initBlogSummary();
} else {
  window.addEventListener('load', initBlogSummary);
}
