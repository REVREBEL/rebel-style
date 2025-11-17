/*! ------------------ ADDING THE SCRIPT: ------------------ */

/*
<!-- START Blog Category tags -->
<script
  defer
  src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/blog-category-tags.js"
  type="text/javascript"
  referrerpolicy="no-referrer"
  crossorigin="anonymous">
</script>
<!-- END Blog Category tags -->
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
<<<<<<< Updated upstream
 * <wf-join-attr 
=======
 * <wf-category-tag 
 *   category-slug="Revenue Strategy"
 *   category-primary-color="#163666"
 *   category-inverse-color="#B2D3dE">
 *   <div class="output"></div>
 * </wf-category-tag>
 * ```
 */



/**
 * Custom Web Component: <wf-category-tag>
 *
 * Dynamically applies category name, slugified class, and optional
 * text/background color styles to its target element.
 *
 * @example
 * ```html
 * <wf-category-tag 
>>>>>>> Stashed changes
 *   category-slug="Revenue Strategy"
 *   category-primary-color="#163666"
 *   category-inverse-color="#B2D3dE">
 *   <div class="output"></div>
 * </wf-category-tag>
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
      "category-slug",
      "category-primary-color",
      "category-inverse-color",
      "category-text-color",
      "category-background-color"
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
    // Ensure input is a string to prevent errors with non-string values.
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    const backgroundColor = this.getAttribute("category-primary-color") || "";
    const textColor = this.getAttribute("category-inverse-color") || "";
    const borderColor = this.getAttribute("category-primary-color") || "";
=======
=======
>>>>>>> Stashed changes
    const primaryColor = this.getAttribute("category-primary-color") || "";
    const inverseColor = this.getAttribute("category-inverse-color") || "";
    // Use specific colors if available, otherwise fall back to primary/inverse.
    const backgroundColor = this.getAttribute("category-background-color") || primaryColor || "";
    const textColor = this.getAttribute("category-text-color") || inverseColor || "";
    const borderColor = backgroundColor; // Border should match the final background color
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

    const outputClass = `blog_category-${this.slug(categorySlug)}`;
    const target = this.querySelector(".output") || this;

    // Add the new class without removing existing ones.
    target.classList.add(outputClass);

    // Optional color application if attributes are provided
    if (textColor) target.style.color = textColor;
    if (borderColor) target.style.borderColor = borderColor;
    if (backgroundColor) target.style.backgroundColor = backgroundColor;

    // Debugging log for inspection
    console.log({
      categoryName: categorySlug,
      primaryColor,
      inverseColor,
      textColor,
      borderColor,
      backgroundColor,
      outputClass,
      target
    });
  }
}


/**
 * Registers the custom element <wf-join-attr> with the browser.
 */
customElements.define("wf-join-attr", WfJoinAttr);
