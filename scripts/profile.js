import userController from '/userController.js';
import teacherController from '/teacherController.js';
import studentController from '/studentController.js';
import groupController from '/groupController.js';
import subjectController from '/subjectController.js';

const token = localStorage.getItem('token');
const seqButton = document.getElementById("change-sequrety-button");
const seqForm = document.getElementById("change-sequrety-form");
const nameButton = document.getElementById("change-name-button");
const nameForm = document.getElementById("change-name-form");

const emailInput = document.getElementById('Email');
const EmailName = document.getElementById('EmailName');
const passwordOldInput = document.getElementById('Password-old');
const passwordInput = document.getElementById("Password");
const passwordRepeadInput = document.getElementById("Password-repead");
let passwordError = '';
let passwordRepeadError = '';
let numberColor = 0;


if (!token) {
    // Перенаправляем на страницу входа, если токена нет
    window.location.href = '/login';
};


async function getUserProfile() {
    try {
        const response = await fetch('http://localhost:3000/api/setDataToToken', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });


        if (!response.ok) {
            throw new Error('Ошибка при получении профиля');
        }

        const data = await response.json();
        const user = data.user;

        localStorage.setItem('userId', user.id);
        localStorage.setItem('userRole', user.role);
        document.getElementById('EmailName').textContent = `Email: ${user.email}`;
        document.getElementById('Email').value = `${user.email}`;

        if (user.role === "Student") {
            const student = data.student;
            localStorage.setItem('studentId', student.id);
            localStorage.setItem('groupId', student.GroupId);

            document.getElementById('FullName').textContent = `${student.Surname} ${student.Name} ${student.Patronymic}`;
            document.getElementById('GroupName').textContent = `Группа: ${await groupController.fetchGroupById(student.GroupId)}`;
            document.getElementById('Name').value = `${student.Name}`;
            document.getElementById('Surname').value = `${student.Surname}`;
            document.getElementById('Patronymic').value = `${student.Patronymic}`;
        } else {
            const teacher = data.teacher;
            localStorage.setItem('teacherId', teacher.id);

            document.getElementById('FullName').textContent = `${teacher.Surname} ${teacher.Name} ${teacher.Patronymic}`;

            document.getElementById('Name').value = `${teacher.Name}`;
            document.getElementById('Surname').value = `${teacher.Surname}`;
            document.getElementById('Patronymic').value = `${teacher.Patronymic}`;

            await updateTeacherSubjects();

            document.getElementById('add-subject-form').addEventListener('submit', async (event) => {
                event.preventDefault();

                const groupId = document.getElementById('group-without-subject-choice').value;
                const subjectId = document.getElementById('Subject').value;
                const teacherId = localStorage.getItem("teacherId");

                await groupController.addSubjectToGroup(groupId, subjectId, teacherId);

                await updateTeacherSubjects();
            });

            document.getElementById('delete-subject-form').addEventListener('submit', async (event) => {
                event.preventDefault();

                const groupId = document.getElementById('group-with-subject-choice').value;
                const subjectId = document.getElementById('subject').value;
                const teacherId = localStorage.getItem("teacherId");

                await groupController.deleteSubjectFromGroup(groupId, subjectId, teacherId);

                await updateTeacherSubjects();
            });

        }

    } catch (err) {
        console.error('Ошибка при загрузке профиля:', err);
        alert('Ошибка при загрузке профиля. Войдите снова.');
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
}

async function updateTeacherSubjects() {
    const teacherId = localStorage.getItem("teacherId");
    const subjects = await teacherController.getTeacherSubjects(teacherId);
    const colorsClass = ["color-two", "color-three", "color-four", "color-five"];
    const subjectsContainer = document.getElementById('SubjectsName');
    subjectsContainer.innerHTML = "";
    
    subjects.forEach(async subject => {

        let row = document.createElement("div");
        row.classList.add("subject");
        row.classList.add(colorsClass[subject.id%4]);

        // let deleteButton = document.createElement("div");
        // deleteButton.classList.add("subject-delete-button");
        // deleteButton.addEventListener('click', (event) => {
        //     //deleteAssessment(assessment.id); // Вызываем функцию удаления
        // });

        let subjectDiv = document.createElement("div");
        let groupList = await groupController.fetchGroupsBySubject(subject.id);

        subjectDiv.classList.add("text-subject");
        subjectDiv.textContent = `${subject.Name} (${groupList.map(i => i.Name).join(", ")})`;


        // row.appendChild(deleteButton);
        row.appendChild(subjectDiv);

        subjectsContainer.appendChild(row);
    });

    let subjectId = document.getElementById('Subject').value;
    await groupController.getGroupsWithoutSubject(subjectId);
    subjectId = document.getElementById('subject').value;
    await groupController.fetchGroupsBySubject(subjectId);

}

getUserProfile();

document.addEventListener("DOMContentLoaded", ready);

async function ready() {
    document.getElementById('logout-menu-button').addEventListener('click', async () => {
        const response = await fetch('/logout', {
            method: 'POST',
          });
          if (response.ok) {
            localStorage.removeItem('token'); // Удаляем токен
            localStorage.clear();
            req.session.destroy();
            window.location.href = '/login'; // Перенаправляем на страницу входа
          } else {
            alert('Ошибка при выходе');
          }
    });

    if (document.getElementById('Subject')) {
        document.getElementById('Subject').addEventListener('change', function (e) {
            let selectedSubjectId = document.getElementById('Subject').value;
            groupController.getGroupsWithoutSubject(selectedSubjectId);
        })
    }

    if (document.getElementById('subject')) {
        document.getElementById('subject').addEventListener('change', function (e) {
            let selectedSubjectId = document.getElementById('subject').value;
            groupController.fetchGroupsBySubject(selectedSubjectId);
        })
    }
}




const checkEmail = async function (input) {
    const email = input.value;
    const EmailNameWords = EmailName.textContent.split(' ');
    const curEmail = EmailNameWords[EmailNameWords.length - 1];

    input.setCustomValidity(``);
    if (!email || email === curEmail) {
        return;
    }
    try {
        const response = await fetch('http://localhost:3000/api/check-email', {
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

seqButton.addEventListener("click", validateEmailInput);




const checkPassword = async function (input) {
    const password = input.value;
    passwordError = '';
    input.setCustomValidity(''); // Сброс ошибки перед проверкой

    if (!password) {
        return; // Если поле пустое — просто выходим
    }

    try {
        const response = await fetch(`http://localhost:3000/api/check-password/${localStorage.getItem("userId")}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Password: password })
        });

        const data = await response.json();
        console.log('Ответ от сервера:', data);

        if (!data.valid) {
            passwordError = 'Неверный пароль.';
        }
    } catch (err) {
        console.error('Ошибка при проверке пароля:', err);
        passwordError = 'Ошибка при проверке пароля.';
    }

    //input.reportValidity(); // Обновляем валидность после ответа
};

passwordOldInput.addEventListener('input', () => {
    checkPassword(passwordOldInput); // Валидация при каждом изменении поля
});

const validatePasswordInput = async () => {
    passwordOldInput.setCustomValidity(passwordError);
    passwordOldInput.reportValidity();

    let css = document.createElement('style');
    css.textContent = 'input:invalid, select:invalid { border: rgb(221, 24, 24) solid 1px; }';
    document.head.appendChild(css);
};

seqButton.addEventListener('click', (event) => {
    validatePasswordInput();
});



const checkPasswordRepead = (input) => {
    input.setCustomValidity("");
    if (input.value !== passwordInput.value) {
        passwordRepeadError = `Пароли не совпадают.`;
    } else {
        passwordRepeadError = "";

    }
};


passwordRepeadInput.addEventListener("input", () => {
    checkPasswordRepead(passwordRepeadInput);
});

const validatePasswordRepeadInput = () => {
    passwordRepeadInput.setCustomValidity(passwordRepeadError);
    passwordRepeadInput.reportValidity();

    let css = document.createElement('style');
    css.textContent = 'input:invalid, select:invalid { border: rgb(221, 24, 24) solid 1px; }';
    document.head.appendChild(css);
};


seqButton.addEventListener('click', (event) => {
    validatePasswordRepeadInput();
});


seqForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    await userController.updateUser(localStorage.getItem("userId"));

    localStorage.removeItem('token');
    window.location.href = '/login';
});

nameForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (localStorage.getItem("userRole") === "Student") {
        await studentController.updateStudent(localStorage.getItem("studentId"));
    } else if (localStorage.getItem("userRole") === "Teacher") {
        await teacherController.updateTeacher(localStorage.getItem("teacherId"));
    }

    window.location.href = '/profile';
});