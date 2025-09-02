
/*! ------------------ ADDING THE SCRIPT: ------------------ 
ADD IN THE HEADER
<!-- START Form Validation -->
<script
defer src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/validation.js"
type="text/javascript" 
referrerpolicy="no-referrer" 
crossorigin="anonymous" 
>
</script>
<!-- END Form Validation -->
*/



window.Alpine && Alpine.data('wizard', wizard);

function wizard() {
  return {
    // --- State
    step: 1,
    maxStep: 3,
    form: {
      firstName: '',
      lastName: '',
      phone: ''
    },
    touched: {
      firstName: false,
      lastName: false,
      phone: false
    },
    errors: {
      firstName: '',
      lastName: '',
      phone: ''
    },
    submitBlocked: false,

    // --- Initialization
    init() {
      // Pre-fill form from localStorage if available
      this.form.firstName = localStorage.getItem('rev:firstName') || '';
      this.form.lastName = localStorage.getItem('rev:lastName') || '';
    },

    // --- Helpers
    touch(field) {
      if (!this.touched.hasOwnProperty(field)) return; // Guard against unknown fields
      this.touched[field] = true;
      this.validate(field);

      // Persist to localStorage
      if ((field === 'firstName' || field === 'lastName') && this.form[field]) {
        localStorage.setItem(`rev:${field}`, this.form[field]);
      }
    },
    invalid(field) {
      // Return a CSS class name when field has an error
      return this.errors[field] ? 'is-invalid' : '';
    },

    // --- Navigation
    goNext() {
      // Validate all fields in the current step before moving on
      const ok = this.validateStep(this.step);
      if (ok && this.step < this.maxStep) {
        this.step++;
      }
    },
    goPrev() {
      if (this.step > 1) {
        this.step--;
      }
    },

    // --- Validation
    validate(field) {
      if (!this.errors.hasOwnProperty(field)) return;
      // Clear first
      this.errors[field] = '';

      switch (field) {
        case 'firstName':
          if (!this.form.firstName) {
            this.errors.firstName = 'Please enter your first name.';
          } else if (this.form.firstName.length < 2) {
            this.errors.firstName = 'Name looks too short.';
          }
          break;
        case 'lastName':
          if (!this.form.lastName) {
            this.errors.lastName = 'Please enter your last name.';
          } else if (this.form.lastName.length < 2) {
            this.errors.lastName = 'Name looks too short.';
          }
          break;
        case 'phone':
          const digits = this.onlyDigits(this.form.phone);
          // US-style default: 10 digits (or 11 if it starts with a leading "1")
          const valid10 = digits.length === 10;
          const valid11 = (digits.length === 11 && digits.startsWith('1'));
          if (!digits) {
            this.errors.phone = 'Please enter your mobile number.';
          } else if (!(valid10 || valid11)) {
            this.errors.phone = 'Enter a valid 10-digit US phone number.';
          }
          break;
      }
    },
    validateStep(step) {
      // Validate only fields that belong to this step
      let fieldsToValidate = [];
      if (step === 1) {
        fieldsToValidate = ['firstName', 'lastName'];
      } else if (step === 2) {
        fieldsToValidate = ['phone'];
      }

      fieldsToValidate.forEach(field => this.touch(field));

      return fieldsToValidate.every(field => !this.errors[field]);
    },

    // --- Phone formatting (simple, friendly US mask)
    onlyDigits: (v) => (v || '').replace(/\D+/g, ''),
    formatPhone() {
      let d = this.onlyDigits(this.form.phone);

      // Don't format until there are digits
      if (!d.length) {
        this.form.phone = '';
        return;
      }

      // Handle US country code
      if (d.length > 10 && d.startsWith('1')) {
        d = d.slice(1);
      }

      // Cap at 10 digits for formatting
      d = d.slice(0, 10);

      if (d.length <= 3) {
        this.form.phone = d;
      } else if (d.length <= 6) {
        this.form.phone = `(${d.slice(0, 3)}) ${d.slice(3)}`;
      } else {
        this.form.phone = `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
      }

      // Re-validate as they type
      if (this.touched.phone) {
        this.validate('phone');
      }
    },

    // --- Submit
    handleSubmit(e) {
      // Final gate: validate all steps’ required fields
      Object.keys(this.form).forEach(f => this.touch(f));

      const anyError = Object.values(this.errors).some(v => !!v);
      if (anyError) {
        this.submitBlocked = true;

        // Auto-jump to the earliest step with an error
        if (this.errors.firstName || this.errors.lastName) {
          this.step = 1;
        } else if (this.errors.phone) {
          this.step = 2;
        }

        return; // block submit
      }

      this.submitBlocked = false;

      // If you need the raw 10 digits for backend, create a hidden input:
      this.ensureHiddenDigitsField(e.target);

      // Let Webflow submit normally:
      e.target.submit();
    },

    ensureHiddenDigitsField(formEl) {
      const existing = formEl.querySelector('input[name="phone_digits"]');
      const digits = this.onlyDigits(this.form.phone);
      if (existing) {
        existing.value = digits;
      } else {
        const hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.name = 'phone_digits';
        hidden.value = digits;
        formEl.appendChild(hidden);
      }
    }
  };
}