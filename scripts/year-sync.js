/**
 * @file year-sync.js
 * @description
 * The NW Auto-Update Year Tool is a lightweight Webflow utility that automatically updates
 * the year displayed on your website without requiring manual edits. It is especially useful
 * for footer sections or anywhere the current year should always be accurate.
 *
 * ------------------ ADDING THE SCRIPT ------------------
 *
 * <!-- START Auto-Update Year -->
 * <script
 *   defer
 *   src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/year-sync.js"
 *   type="text/javascript"
 *   referrerpolicy="no-referrer"
 *   crossorigin="anonymous">
 * </script>
 * <!-- END Auto-Update Year -->
 *
 * ------------------ IMPLEMENTATION STEPS ------------------
 * Step 1: Add the script to Webflow
 * - Go to "Pages" → Settings of the page you want.
 * - Scroll down to the "Before </body> tag" section.
 * - Paste the script tag shown above.
 * - If the year should update across all or most pages, paste into Project Settings → Custom Code → "Before </body> tag".
 *
 * Step 2: Apply the custom attribute
 * - Select the text element where you want the year to appear.
 * - In the Element Settings panel, add the following attribute:
 *   - Name: data-year
 *
 * Step 3: Publish your site
 * - First publish to staging to verify correct behavior.
 * - Once confirmed, publish to your live site.
 *
 * By following these steps, the Auto-Update Year Tool will automatically refresh each year.
 */

/**
 * Initializes the Auto-Update Year functionality once the DOM has fully loaded.
 * It locates the element with the attribute `[data-year]`, inserts the current year,
 * and ensures it updates at midnight every day.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Select the element where the year will be displayed
  const yearElement = document.querySelector("[data-year]");

  if (yearElement) {
    /**
     * Updates the text content of the target element with the current year.
     * @function updateYear
     */
    const updateYear = () => {
      const currentYear = new Date().getFullYear();
      yearElement.textContent = currentYear;
    };

    // Initial call to set the year immediately
    updateYear();

    // Calculate the time remaining until the next midnight
    const now = new Date();
    const timeUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;

    /**
     * Sets a timer to trigger the first midnight update and schedules subsequent
     * updates every 24 hours thereafter.
     */
    setTimeout(() => {
      updateYear();
      setInterval(updateYear, 24 * 60 * 60 * 1000); // 24 hours
    }, timeUntilMidnight);
  }
});
