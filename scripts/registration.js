const passwordInput = document.getElementById("Password");
const passwordRepeadInput = document.getElementById("Password-repead");
const regButton = document.getElementById("registration-button");

const check = (input) => {
  // Handle cases where input is too vague
  if (input.value == passwordInput.value) {
    input.setCustomValidity(`"${input.value}" is not a feeling.`);
  } else {
    // An empty string resets the custom validity state
    input.setCustomValidity("");
  }
};

passwordRepeadInput.addEventListener("input", () => {
  check(passwordRepeadInput);
});

const validateInput = () => {
  passwordRepeadInput.reportValidity();
  if (passwordRepeadInput.validity.customError) {
    // We can handle custom validity states here
  } else {
  }
};

regButton.addEventListener("click", validateInput);
