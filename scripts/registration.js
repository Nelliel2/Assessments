import studentController from '/studentController.js';
import userController from '/userController.js';
import groupController from '/groupController.js';

const passwordInput = document.getElementById("Password");
const passwordRepeadInput = document.getElementById("Password-repead");
const regButton = document.getElementById("registration-button");
const regForm = document.getElementById('registration-form');


const check = (input) => {
  if (input.value !== passwordInput.value) {
    input.setCustomValidity(`Пароли не совпадают.`);
  } else {
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

const radioButtons = document.getElementsByName('role');
const groupContainer = document.getElementById('group-container');
const groupSelect = document.getElementById('Group');

function toggleGroupContainer() {
  const selectedRole = document.querySelector('input[name="role"]:checked').value;

  if (selectedRole === 'student') {
    groupContainer.style.display = 'block';
    groupSelect.setAttribute('required', 'required'); // Делаем поле обязательным
    groupController.fetchGroups();
  } else {
    groupContainer.style.display = 'none';
    groupSelect.removeAttribute('required'); // Делаем поле необязательным
    groupSelect.value = ''; // Сбрасываем выбор
  }
}

// Привязываем обработчик к каждому радио-инпуту
radioButtons.forEach(radio => {
  radio.addEventListener('change', toggleGroupContainer);
});

// Устанавливаем правильное состояние при загрузке страницы
toggleGroupContainer();

regButton.addEventListener("click", validateInput);

async function createUser() {
  const Name = document.getElementById('Name').value;
  const Surname = document.getElementById('Surname').value;
  const Patronymic = document.getElementById('Patronymic').value;
  const GroupId = Number(document.getElementById('Group').value);

  const StudentId = await studentController.addStudent(Name, Surname, Patronymic, GroupId);

  console.log(StudentId);

  const Email = document.getElementById('Email').value;
  const Password = document.getElementById('Password').value;

  userController.addUser(Email, Password, StudentId, null);
  return '/login.html';
}

regForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  regForm.action = await createUser();

  window.location.href = '/login.html';
});

