/*! ------------------ ADDING THE SCRIPT: ------------------ 

<!-- START Calculate Read Time -->
<script
  defer
  src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/blog-category-tags.js"
  type="text/javascript"
  referrerpolicy="no-referrer"
  crossorigin="anonymous">
</script>
<!-- END Calculate Read Time -->

*/

/*! ------------------ HOW TO USE IN WEBFLOW --------------- 
/**
 * Custom Web Component: <wf-join-attr>
 * 
 * Dynamically applies category name, text color, and background color
 * as class names and inline styles to its target element.
 * 
 * Usage:
 * ```html
 * <wf-join-attr 
 *   category-slug="Revenue Strategy"
 *   category-primary-color="#163666"
 *   category-inverse-color="#B2D3dE">
 *   <div class="output"></div>
 * </wf-join-attr>
 * ```
 */



/**
 * Custom Web Component: <wf-join-attr>
 *
 * Dynamically applies category name, slugified class, and optional
 * text/background color styles to its target element.
 *
 * @example
 * ```html
 * <wf-join-attr 
 *   category-slug="Revenue Strategy"
 *   category-primary-color="#163666"
 *   category-inverse-color="#B2D3dE">
 *   <div class="output"></div>
 * </wf-join-attr>
 * ```
 */
class WfJoinAttr extends HTMLElement {
  /**
   * Attributes this custom element observes for changes.
   * When any of these attributes change, {@link attributeChangedCallback} is triggered.
   *
   * @returns {string[]} List of observed attribute names.
   */
  static get observedAttributes() {
    return [
      "category-slug"
      // "category-primary-color",
      // "category-inverse-color"
    ];
  }

  /**
   * Lifecycle callback executed when the element is connected to the DOM.
   * Automatically initializes rendering by calling {@link update}.
   *
   * @returns {void}
   */
  connectedCallback() {
    this.update();
  }

  /**
   * Lifecycle callback executed when observed attributes change.
   * Automatically re-renders the element by calling {@link update}.
   *
   * @returns {void}
   */
  attributeChangedCallback() {
    this.update();
  }

  /**
   * Converts a string into a safe slug suitable for CSS class names.
   * Removes quotes, spaces, and special characters, replacing them with hyphens.
   *
   * @param {string} [input=""] - Input string to slugify.
   * @returns {string} Slugified string safe for use in class names.
   */
  slug(input = "") {
    return String(input)
      .trim()
      .toLowerCase()
      .replace(/["']/g, "")            // remove quotes
      .replace(/[^a-z0-9\-_]+/g, "-")  // replace non-alphanumeric with hyphen
      .replace(/^-+|-+$/g, "");        // trim leading/trailing hyphens
  }

  /**
   * Updates the component’s target element by:
   * 1. Creating a slug-based class from the `category-slug` attribute.
   * 2. Assigning that class name to the `.output` child (or to the host if none exists).
   * 3. Optionally applying inline text and background colors from attributes.
   *
   * @returns {void}
   */
  update() {
    const categorySlug = this.getAttribute("category-slug") || "";
    // const backgroundColor = this.getAttribute("category-primary-color") || "";
    // const textColor       = this.getAttribute("category-inverse-color") || "";

    const outputClass = `blog_category-${this.slug(categorySlug)}`;
    const target = this.querySelector(".output") || this;

    // Apply class (default behavior)
    target.setAttribute("class", outputClass);

    // Optional color application if attributes are provided
    // if (textColor) target.style.color = textColor;
    // if (backgroundColor) target.style.backgroundColor = backgroundColor;

    // Debugging log for inspection
    console.log({
      categoryName: categorySlug,
      // textColor,
      // backgroundColor,
      outputClass,
      target
    });
  }
}

/**
 * Registers the custom element <wf-join-attr> with the browser.
 */
customElements.define("wf-join-attr", WfJoinAttr);
