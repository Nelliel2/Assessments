const passwordInput = document.getElementById("Password");
const passwordRepeadInput = document.getElementById("Password-repead");
const regButton = document.getElementById("registration-button");

const check = (input) => {
  // Handle cases where input is too vague
  if (input.value !== passwordInput.value) {
    input.setCustomValidity(`"Пароли не совпадают.`);
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

  let css = document.createElement('style');
  css.textContent = 'input:invalid, select:invalid { border: rgb(221, 24, 24) solid 1px; }'; 
  document.head.appendChild(css);
  
  if (passwordRepeadInput.validity.customError) {
    // We can handle custom validity states here
  } else {
  }
};

regButton.addEventListener("click", validateInput);
