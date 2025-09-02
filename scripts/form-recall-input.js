/*! ------------------ ADDING THE SCRIPT: ------------------ 
<!-- START Form Recall Input -->
<script
defer src="https://cdn.jsdelivr.net/gh/REVREBEL/rebel-style@main/scripts/form-recall-input.js"
type="text/javascript" 
referrerpolicy="no-referrer" 
crossorigin="anonymous" 
>
</script>
<!-- END Form Recall Input -->
*/

document.addEventListener("DOMContentLoaded", function () {
  const firstNameInput = document.getElementById("dataSubjectFirstName");
  const lastNameInput = document.getElementById("dataSubjectLastName");
  const nameOutput = document.getElementById("recall_fullName");

  function updateFullName() {
    const first = firstNameInput ? firstNameInput.value.trim() : "";
    const last = lastNameInput ? lastNameInput.value.trim() : "";

    // Use innerHTML so &nbsp; is rendered as a space
    if (first || last) {
      nameOutput.innerHTML = "&nbsp;" + first + (last ? " " + last : "") + "&nbsp;";
    } else {
      nameOutput.innerHTML = "";
    }
  }

  if (firstNameInput) {
    firstNameInput.addEventListener("input", updateFullName);
    firstNameInput.addEventListener("blur", updateFullName);
  }

  if (lastNameInput) {
    lastNameInput.addEventListener("input", updateFullName);
    lastNameInput.addEventListener("blur", updateFullName);
  }
});
