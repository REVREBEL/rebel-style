/**
 * @file ga-whitelist.js
 * @description
 * Webflow Whitelisting Tool for Google Analytics (GA4).
 * 
 * This script prevents Google Analytics from tracking activity while using
 * Webflow Editor or Designer mode, ensuring your analytics data stays clean.
 * 
 * ------------------ ADDING THE SCRIPT ------------------
 * 
 * - Place the script in: Project Settings → Custom Code → <head> section.
 * - Replace the placeholder Measurement ID with your actual Google Analytics 4 (GA4) ID.
 *   Example: G-XXXXXXXXXX
 * 
 * ------------------ COMMON ISSUES & TROUBLESHOOTING ------------------
 * 1. **Measurement ID Errors**
 *    - Verify your GA4 Measurement ID matches exactly what’s in your Google Analytics dashboard.
 *    - Find it via: Admin → Data Streams → Web Stream Details.
 * 
 * 2. **Script Placement**
 *    - Must be added to the HEAD section of your site settings.
 *    - If placed in the Footer or Body, GA may initialize incorrectly and ignore the filter.
 * 
 * 3. **Caching Issues**
 *    - Clear browser cache or test in Incognito mode if changes don’t show immediately.
 * 
 * 4. **Real-Time Data Still Appears**
 *    - In Editor/Designer mode, open DevTools Console.
 *    - Look for: `"Google Analytics disabled for Webflow Editor/Designer mode."`
 *    - If missing, confirm script placement and Measurement ID.
 * 
 * 5. **Testing Environment**
 *    - Always test on staging or password-protected sites first to avoid polluting live GA data.
 * 
 * By following these steps, you will successfully implement the GA Whitelisting tool.
 */

/**
 * Google Analytics Measurement ID for your property.
 * Replace this value with your actual GA4 ID.
 * @type {string}
 */
var measurementID = 'G-VF5Z5N3FMD';

/**
 * Checks if the current environment is Webflow Editor or Designer.
 * @returns {boolean} True if in Editor or Designer mode, otherwise false.
 */
function isWebflowEditorOrDesigner() {
  return window.location.search.includes('?edit') || window.WebflowEditor;
}

/**
 * Disables Google Analytics tracking in Webflow Editor/Designer mode
 * by setting the global GA disable flag for the current Measurement ID.
 */
if (isWebflowEditorOrDesigner()) {
  window['ga-disable-' + measurementID] = true;
  console.log('Google Analytics disabled for Webflow Editor/Designer mode.');
}
