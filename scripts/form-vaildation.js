/*! ------------------ ADDING THE SCRIPT: ------------------ 
<!-- START Form Vaildation-->
<script
defer src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/form-vaildation.js"
type="text/javascript" 
referrerpolicy="no-referrer" 
crossorigin="anonymous" 
>
</script>
<!-- END Form Vaildation -->
*/

/**
 * @overview Webflow Multi-Step Form Validation
 * @version 2.1
 *
 * This script provides client-side validation for multi-step forms built
 * with Webflow's slider component. It prevents users from advancing to the
 * next slide until all required fields on the current slide are valid.
 *
 * --- HOW TO USE IN WEBFLOW ---
 *
 * 1.  **Mark Required Fields:**
 *     For any input that must be filled out, select the element and go to:
 *     Element Settings (D) > Custom Attributes
 *     - Name: `required`
 *     - Value: `required`
 *     This works for text fields, text areas, select dropdowns, and single
 *     checkboxes that must be ticked.
 *
 * 2.  **Mark Required Groups (e.g., Checkboxes):**
 *     To require that at least one checkbox in a group is selected, wrap
 *     the checkboxes in a Div Block and add this attribute to the Div:
 *     - Name: `data-required-group`
 *     - Value: `amenities` (or any descriptive name)
 *
 * 3.  **Configure "Next" Buttons:**
 *     The script automatically works with Webflow's default slider arrows.
 *     If you use custom buttons to go to the next slide, give them the
 *     class `next-btn` in the Style Panel (S).
 *
 * --- SUMMARY OF ATTRIBUTES ---
 *
 * - `[required]` or `[data-required="true"]`: On an input, select, textarea, or single checkbox.
 * - `[data-required-group="group-name"]`: On a div wrapping multiple checkboxes to require at least one.
 * - `.next-btn` (class): On any custom element used as a "Next" button.
 *
 * The script handles the rest, including showing an error popup and adding
 * a red border to invalid fields or groups.
 */
(function() {
  "use strict";

  // --- Configuration ---
  const FORM_SELECTOR = 'form';
  const SLIDER_SELECTOR = '.w-slider';
  const SLIDE_SELECTOR = '.w-slide';
  const NEXT_BUTTON_SELECTOR = '.next-btn, .w-slider-arrow-right';
  const REQUIRED_FIELD_SELECTOR = '[required], [data-required="true"]';
  const REQUIRED_GROUP_SELECTOR = '[data-required-group]';
  const ERROR_BORDER_STYLE = '2px solid red';

  /**
   * Boots the validation script once the DOM is ready.
   */
  function boot() {
    const form = document.querySelector(FORM_SELECTOR);
    if (!form) {
      console.warn('[Form Validation] No <form> element found. Script will not run.');
      return;
    }

    // Find the slider, accommodating different structures (e.g., form inside slider).
    const slider = form.querySelector(SLIDER_SELECTOR) || form.closest(SLIDER_SELECTOR) || document.querySelector(SLIDER_SELECTOR);
    if (!slider) {
      // Updated error message for better diagnostics.
      console.warn('[Form Validation] No .w-slider element found on the page or associated with the form. Script will not run.');
      return;
    }

    console.log('[Form Validation] Initialized successfully.');

    /**
     * Finds the currently visible slide in the Webflow slider.
     * @returns {HTMLElement|null} The active slide element.
     */
    function getActiveSlide() {
      // Webflow's active slide is the one not hidden. This is more reliable than
      // checking for a specific class name or assuming `aria-hidden="false"`.
      let activeSlide = slider.querySelector(`${SLIDE_SELECTOR}:not([aria-hidden="true"])`);
      if (activeSlide) {
        return activeSlide;
      }

      // Fallback for cases where aria-hidden isn't used as expected.
      // Find the active dot and get the corresponding slide index.
      const nav = slider.querySelector('.w-slider-nav');
      if (nav) {
        const activeDot = nav.querySelector('.w-slider-dot.w-active');
        if (activeDot) {
          const allDots = Array.from(nav.children);
          const activeIndex = allDots.indexOf(activeDot);
          if (activeIndex !== -1) {
            const allSlides = slider.querySelectorAll(SLIDE_SELECTOR);
            if (allSlides[activeIndex]) {
              console.warn('[Form Validation] Fallback: Found active slide via slider nav dot.');
              return allSlides[activeIndex];
            }
          }
        }
      }

      // Final fallback: assume the first slide is active if none is marked.
      const firstSlide = slider.querySelector(SLIDE_SELECTOR);
      if (firstSlide) {
        console.warn('[Form Validation] Fallback: Assuming first slide is active.');
        return firstSlide;
      }

      return null;
    }

    /**
     * Validates all required fields within a given slide.
     * @param {HTMLElement} slide - The slide element to validate.
     * @returns {boolean} - True if the slide is valid, false otherwise.
     */
    function validateSlide(slide) {
      if (!slide) return false;

      const fields = slide.querySelectorAll(REQUIRED_FIELD_SELECTOR);
      let isSlideValid = true;

      // First, clear previous error styles from all fields and groups in the slide
      slide.querySelectorAll('input, select, textarea, ' + REQUIRED_GROUP_SELECTOR).forEach(el => {
        el.style.border = '';
      });

      // --- Individual Field Validation ---
      fields.forEach(field => {
        let isFieldValid = true;
        const value = field.value.trim();

        if (field.type === 'checkbox') {
          // A single checkbox with `required` must be checked.
          isFieldValid = field.checked;
        } else if (value === '') {
          isFieldValid = false;
        }

        if (field.type === 'email' && value && !/^\S+@\S+\.\S+$/.test(value)) {
          isFieldValid = false;
        }

        // Add phone number validation if libphonenumber is available
        if (field.type === 'tel' && value && window.libphonenumber) {
          // You can make the default country configurable if needed
          if (!window.libphonenumber.isValidPhoneNumber(value, 'US')) {
            isFieldValid = false;
          }
        }

        if (!isFieldValid) {
          isSlideValid = false;
          field.style.border = ERROR_BORDER_STYLE;
        }
      });

      // --- Group Validation (e.g., "at least one checkbox") ---
      const groups = slide.querySelectorAll(REQUIRED_GROUP_SELECTOR);
      groups.forEach(group => {
        const checkboxes = group.querySelectorAll('input[type="checkbox"]');
        if (checkboxes.length === 0) return; // Skip if no checkboxes in group

        // Check if at least one checkbox in the group is checked
        const isGroupValid = Array.from(checkboxes).some(cb => cb.checked);

        if (!isGroupValid) {
          isSlideValid = false;
          // Apply error style to the group wrapper
          group.style.border = ERROR_BORDER_STYLE;
        }
      });

      return isSlideValid;
    }

    /**
     * Displays a temporary error message popup.
     * @param {string} message - The error message to display.
     */
    function showError(message) {
      // Remove any existing error popup to prevent duplicates
      const existingError = document.querySelector('.error-popup');
      if (existingError) existingError.remove();

      const errorPopup = document.createElement('div');
      errorPopup.className = 'error-popup';
      errorPopup.textContent = message;
      errorPopup.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #d9534f;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 99999;
        font-size: 16px;
        text-align: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        transition: opacity 0.3s, transform 0.3s;
        opacity: 0;
      `;
      document.body.appendChild(errorPopup);

      // Animate in
      setTimeout(() => {
        errorPopup.style.opacity = '1';
        errorPopup.style.transform = 'translateX(-50%) translateY(10px)';
      }, 10);

      // Automatically remove after 3 seconds
      setTimeout(() => {
        errorPopup.style.opacity = '0';
        errorPopup.style.transform = 'translateX(-50%)';
        setTimeout(() => errorPopup.remove(), 300);
      }, 3000);
    }

    // --- Event Listeners ---

    // Listen for clicks on "Next" buttons using event delegation.
    // We use the 'capture' phase to run our validation *before* Webflow's native slider logic.
    document.body.addEventListener('click', function(e) {
      const nextButton = e.target.closest(NEXT_BUTTON_SELECTOR);
      if (!nextButton || !slider.contains(nextButton)) return;

      const activeSlide = getActiveSlide();
      if (!activeSlide) {
        console.error('[Form Validation] Could not find the active slide.');
        return;
      }

      if (!validateSlide(activeSlide)) {
        // If validation fails, stop the click from propagating and prevent
        // Webflow's slider from advancing.
        e.preventDefault();
        e.stopImmediatePropagation();
        showError('Please fill out all required fields.');
      }
      // If validation passes, we do nothing and let the event proceed normally.
    }, true);

    // Listen for the final form submission.
    form.addEventListener('submit', function(e) {
      const allSlides = slider.querySelectorAll(SLIDE_SELECTOR);
      let isFormValid = true;

      allSlides.forEach(slide => {
        if (!validateSlide(slide)) {
          isFormValid = false;
        }
      });

      if (!isFormValid) {
        e.preventDefault();
        showError('Please review the form, some fields are incomplete.');
        // Optional: you could add logic here to jump to the first invalid slide.
      }
    });
  }

  // Run the script
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
