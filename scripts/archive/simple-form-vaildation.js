/**
 * @file simple-form-validation.js
 * @description
 * Neue World's Simple Form Validation Tool for Webflow.
 *
 * This script validates **email**, **name**, and **phone number** inputs in real time.
 * It adds `success` or `error` combo classes to form fields depending on the validity of input.
 *
 * ------------------ ADDING THE SCRIPT ------------------
 * <!-- START Form Validation -->
 * <script
 *   defer
 *   src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/simple-form-validation.js"
 *   type="text/javascript"
 *   referrerpolicy="no-referrer"
 *   crossorigin="anonymous">
 * </script>
 * <!-- END Form Validation -->
 *
 * ------------------ HOW TO USE ------------------
 * Step 1: Add the script to Webflow
 * - Go to: Page Settings → Before </body> tag.
 * - Paste the script tag above.
 *
 * Step 2: Add Custom Attributes
 * - Apply the following custom attributes (leave the Value blank):
 *   - `nw-email` → Email form field
 *   - `nw-phone` → Phone number form field
 *   - `nw-name` → Name form field
 *
 * Step 3: Style Success & Error States
 * - Add combo classes in Webflow for form styling:
 *   - `success` → applied when input is valid.
 *   - `error` → applied when input is invalid.
 *
 * Step 4: Publish & Test
 * - Test on staging first to confirm proper validation behavior.
 * - Publish to live once verified.
 *
 * ------------------ NOTES ------------------
 * - Email validation: ensures input matches the pattern `abcd@email.com`.
 *   (Does not check if the email itself exists.)
 * - Phone validation: checks if the number contains **7–15 digits**, which
 *   matches the minimum/maximum length globally.
 * - Name validation: disallows inputs that are only numbers.
 */

document.addEventListener("DOMContentLoaded", function() {
  /** @type {HTMLInputElement} Email input field */
  const emailInput = document.querySelector("[nw-email]");
  /** @type {HTMLInputElement} Name input field */
  const inputField = document.querySelector("[nw-name]");
  /** @type {HTMLInputElement} Phone input field */
  const phoneInput = document.querySelector("[nw-phone]");

  /**
   * Validates the email field in real-time.
   * - Adds `success` if valid.
   * - Adds `error` if invalid.
   */
  emailInput.addEventListener("input", function() {
    const email = emailInput.value;

    if (email === "") {
      emailInput.classList.remove("error", "success");
    } else if (!/^[^!#$%&~]*[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailInput.classList.add("error");
      emailInput.classList.remove("success");
    } else {
      emailInput.classList.add("success");
      emailInput.classList.remove("error");
    }
  });

  /**
   * Validates the name field in real-time.
   * - Names consisting only of digits are marked `error`.
   * - All other non-empty values are marked `success`.
   */
  inputField.addEventListener("input", function() {
    const value = inputField.value;

    if (value === "") {
      inputField.classList.remove("success", "error");
    } else if (/^[a-zA-Z\W]+$/.test(value)) {
      inputField.classList.add("success");
      inputField.classList.remove("error");
    } else if (/^[0-9]+$/.test(value)) {
      inputField.classList.add("error");
      inputField.classList.remove("success");
    } else {
      inputField.classList.add("success");
      inputField.classList.remove("error");
    }
  });

  /**
   * Validates the phone field in real-time.
   * - Accepts digits, spaces, dashes, parentheses, and "+".
   * - Requires length between 7 and 15 characters.
   */
  phoneInput.addEventListener("input", function() {
    const phone = phoneInput.value;

    if (phone === "") {
      phoneInput.classList.remove("success", "error");
    } else if (/^[0-9\-\(\)\s+]{7,15}$/.test(phone)) {
      phoneInput.classList.add("success");
      phoneInput.classList.remove("error");
    } else {
      phoneInput.classList.add("error");
      phoneInput.classList.remove("success");
    }
  });
});
