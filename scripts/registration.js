import studentController from '/studentController.js';
import teacherController from '/teacherController.js';
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
const groupSelect = document.getElementById('group-name-choice');

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
  const selectedRole = document.querySelector('input[name="role"]:checked').value;
  const Name = document.getElementById('Name').value;
  const Surname = document.getElementById('Surname').value;
  const Patronymic = document.getElementById('Patronymic').value;


  const Email = document.getElementById('Email').value;
  const Password = document.getElementById('Password').value;

  if (selectedRole === 'student') {
    const GroupId = Number(document.getElementById('group-name-choice').value);
    const StudentId = await studentController.addStudent(Name, Surname, Patronymic, GroupId);
    userController.addUser(Email, Password, StudentId, null);
  } else if (selectedRole === 'teacher') {
    const TeacherId = await teacherController.addTeacher(Name, Surname, Patronymic);
    userController.addUser(Email, Password, null, TeacherId);
  }

  return '/login';
}

regForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  regForm.action = await createUser();

  window.location.href = '/login';
});






const emailInput = document.getElementById('Email');

const checkEmail = async function (input) {
  const email = input.value;
  input.setCustomValidity(``);
  if (!email) {
    emailError.style.display = 'none';
    return;
  }
  try {
    const response = await fetch('http://localhost:3000/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Email: email })
    });

    const data = await response.json();

    if (data.exists) {
      input.setCustomValidity(`Этот Email уже используется.`);
    }

  } catch (err) {
    console.error('Ошибка при проверке email:', err);
    input.setCustomValidity(`Ошибка при проверке email.`);
  }
};

emailInput.addEventListener("input", () => {
  checkEmail(emailInput);
});

const validateEmailInput = () => {
  emailInput.reportValidity();

  let css = document.createElement('style');
  css.textContent = 'input:invalid, select:invalid { border: rgb(221, 24, 24) solid 1px; }';
  document.head.appendChild(css);

  if (emailInput.validity.customError) {
    // We can handle custom validity states here
  } else {
  }
};

regButton.addEventListener("click", validateEmailInput);