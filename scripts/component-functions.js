/** 
 * Component Name: Social-Buttons
 *
 * This script ensures that social icon elements have a valid `data-icon-size` attribute. 
 * If an invalid or missing value is found, it defaults to `3x3`. 
 * It only initializes once per page load.
 */

(function() {
  /**
   * Handles validation and normalization of social icon sizes.
   * 
   * - Targets elements with the class `.socials_icon-size`
   * - Checks the `data-icon-size` attribute
   * - Enforces valid sizes: "1x1", "2x2", "3x3", "4x4"
   * - Defaults invalid/missing sizes to "3x3"
   *
   * @function handleSocialIconSizing
   * @returns {void}
   */
  function handleSocialIconSizing() {
    console.log("socials_icon-size script running");

    // Prevent multiple initializations
    if (window.socialsIconSizeInitialized) {
      return;
    }
    window.socialsIconSizeInitialized = true;
    console.log("socials_icon-size script initialized");

    /** @constant {string[]} validSizes - Allowed size options */
    const validSizes = ["1x1", "2x2", "3x3", "4x4"];

    /** @type {NodeListOf<HTMLElement>} */
    const icons = document.querySelectorAll(".socials_icon-size");

    icons.forEach(icon => {
      const size = icon.getAttribute("data-icon-size");

      // If invalid or missing, set to default "3x3"
      if (!validSizes.includes(size)) {
        icon.setAttribute("data-icon-size", "3x3");
      }
    });
  }

  // Immediately invoke the handler
  handleSocialIconSizing();
})();




