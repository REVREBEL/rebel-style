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

/*! ------------------ HOW TO USE IN WEBFLOW ---------------

<!-- 1. Add a container for the summary links -->
<div data-blog-summary="summary">
  <!-- Links will be generated here -->
</div>

<!-- 2. Add the attribute to your article's rich text body -->
<div class="w-richtext" data-blog-summary="article-body">
  <!-- Your Webflow Rich Text element with H2, H3, H4, H5, H6 headings -->
</div>

*/

/**
 * Generates a summary navigation from article headings (h2, h3, h4, h5, h6)
 * and enables smooth scrolling to target sections.
 *
 * Behavior:
 * - Scans [data-blog-summary="article-body"] for h2, h3, h4, h5, h6 elements
 * - Assigns IDs based on heading text (slugified)
 * - Creates navigation links inside [data-blog-summary="summary"] using your existing CSS classes
 *   (.link, .headline-xsmall, .headline-small, .headline-regular)
 * - Smooth scrolls to target section on click
 * - On page load with hash, auto-scrolls to section
 */

function initBlogSummary() {
  /** @type {HTMLElement|null} */
  const list = document.querySelector('[data-blog-summary="summary"]');

  /** @type {HTMLElement|null} */
  const body = document.querySelector('[data-blog-summary="article-body"]');

  /** @type {HTMLElement[]} */
  const sections = body ? Array.from(body.querySelectorAll('h2, h3, h4, h5, h6')) : [];

  sections.forEach(section => {
    /** @type {string} Heading text */
    const title = section.innerText;

    /** @type {string} Slugified ID */
    const id = title.trim()
      .toLowerCase()
      .replace(/\s+/g, '-')    
      .replace(/[^\w-]+/g, '');

    // Assign the generated ID to the section
    section.id = id;

    /** @type {HTMLAnchorElement} Navigation link */
    const link = document.createElement('a');
    link.innerHTML = title;
    link.href = `#${id}`;
    link.classList.add('link'); // Base class for all summary links

    // Add headline class based on heading level
    if (section.nodeName === 'H2') {
      link.classList.add('text-size-xlarge');
    } else if (section.nodeName === 'H3') {
      link.classList.add('text-size-large');
    } else if (section.nodeName === 'H4') {
      link.classList.add('text-size-medium');
    } else if (section.nodeName === 'H5') {
      link.classList.add('text-size-regular');
    } else if (section.nodeName === 'H6') {
      link.classList.add('text-size-small');
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

    // Wrap link in a div to ensure it renders on a new line
    const linkWrapper = document.createElement('div');
    linkWrapper.appendChild(link);

    if (list) {
      list.appendChild(linkWrapper);
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
