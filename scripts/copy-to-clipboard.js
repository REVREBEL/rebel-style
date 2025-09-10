/**
 * @file copy-to-clipboard.js
 * @description
 * Neue World's Copy to Clipboard Tool for Webflow.
 *
 * This script enables a one-click "Copy to Clipboard" feature that allows users
 * to copy text instantly without manually selecting and pasting. Perfect for
 * sharing promo codes, links, or reusable snippets.
 *
 * ------------------ ADDING THE SCRIPT ------------------
 * <!-- START Copy to Clipboard -->
 * <script
 *   defer
 *   src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/copy-to-clipboard.js"
 *   type="text/javascript"
 *   referrerpolicy="no-referrer"
 *   crossorigin="anonymous">
 * </script>
 * <!-- END Copy to Clipboard -->
 *
 * ------------------ HOW TO USE ------------------
 * Step 1: Add the script to Webflow
 * - Go to: Page Settings → Before </body> tag section.
 * - Paste the script or link it as shown above.
 *
 * Step 2: Add Custom Attributes
 * - Wrap the text element and the button inside the same parent div.
 * - Apply the following attributes:
 *   - `read-text` → On the element containing the text to copy.
 *   - `copy-button` → On the button that will trigger the copy action.
 *
 * Example:
 * <div class="wrapper">
 *   <span read-text>HELLO WORLD</span>
 *   <button copy-button>Copy</button>
 * </div>
 *
 * Step 3: Publish & Test
 * - Publish to staging and confirm that clicking the button copies the text.
 * - Once verified, push to live site.
 *
 * ------------------ NOTES ------------------
 * - Both `read-text` and `copy-button` must exist inside the same parent wrapper.
 * - Uses a temporary hidden input for cross-browser compatibility.
 */

/**
 * Finds all buttons with the [copy-button] attribute and attaches
 * a click listener to copy the associated [read-text] content.
 */
var copyButtons = document.querySelectorAll("[copy-button]");

copyButtons.forEach(function(copyButton) {
  copyButton.addEventListener("click", function() {
    var clickedElement = this;
    var parentElement = clickedElement.parentNode;

    // Locate the sibling element containing the text to copy
    var articleElement = parentElement.querySelector("[read-text]");
    if (articleElement) {
      var text = articleElement.textContent;

      /**
       * Create a hidden temporary input to use `execCommand("copy")`
       * (ensures compatibility with older browsers).
       */
      var tempInput = document.createElement("input");
      tempInput.style = "position: absolute; left: -1000px; top: -1000px";
      tempInput.value = text;

      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);

      console.log(`Copied to clipboard: ${text}`);
    }
  });
});
