

// Функция для получения списка студентов
async function fetchStudents() {
    try {
        const response = await fetch('http://localhost:3000/api/students'); // Добавлен префикс /api
        if (!response.ok) {
            throw new Error('Failed to fetch students');
        }
        const students = await response.json();

        const select = document.getElementById('student-name-choice');
        select.innerHTML = '';  // Очищаем список
        students.forEach(student => {
            const option = document.createElement('option');
            option.innerHTML = `${student.Name} ${student.Surname} ${student.Patronymic || ''}`;
            option.value = student.id;
            select.appendChild(option);
        });

    } catch (err) {
        console.error(err);
    }
}


// Функция для получения массива студентов
async function getStudentsList() {
    try {
        const response = await fetch('http://localhost:3000/api/students'); // Добавлен префикс /api
        if (!response.ok) {
            throw new Error('Failed to fetch students');
        }
        const students = await response.json();
        let arr = [];
        students.forEach(student => {
            arr.push(`${student.Name} ${student.Surname} ${student.Patronymic || ''}`); // Исправлен синтаксис шаблонной строки
        });
        return arr;
    } catch (err) {
        console.error(err);
        alert('Error fetching students');
    }
}

// Функция для добавления нового студента
async function addStudent() {
    const Name = document.getElementById('Name').value;
    const Surname = document.getElementById('Surname').value;
    const Patronymic = document.getElementById('Patronymic').value; // Добавлено поле Patronymic
    if (!Name || !Surname) {
        alert('Please provide both Name and Surname');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name, Surname, Patronymic }) // Добавлено поле Patronymic
        });

        if (!response.ok) {
            throw new Error('Failed to add student');
        }

        fetchStudents();  // Обновляем список студентов
    } catch (err) {
        console.error(err);
        alert('Error adding student');
    }
}

// Функция для удаления студента
async function deleteStudent(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/students/${id}`, { // Исправлен синтаксис URL
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete student');
        }

        fetchStudents();  // Обновляем список студентов
    } catch (err) {
        console.error(err);
        alert('Error deleting student');
    }
}

// Функция для обновления данных студента
async function updateStudent(id) {
    const Name = prompt("Enter new Name:");
    const Surname = prompt("Enter new Surname:"); // Исправлено на prompt вместо parseFloat
    const Patronymic = prompt("Enter new Patronymic:"); // Добавлено поле Patronymic
    if (!Name || !Surname) {
        alert('Please provide valid Name and Surname');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/students/${id}`, { // Исправлен синтаксис URL
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name, Surname, Patronymic }) // Добавлено поле Patronymic
        });

        if (!response.ok) {
            throw new Error('Failed to update student');
        }

        fetchStudents();  // Обновляем список студентов
    } catch (err) {
        console.error(err);
        alert('Error updating student');
    }
}


// Функция для получения списка студентов
async function fetchStudentsByGroup(groupId) {
    try {
        const response = await fetch(`http://localhost:3000/students/group/${groupId}`); // Используем groupId в URL
        if (!response.ok) {
            throw new Error('Failed to fetch students');
        }
        const students = await response.json();

        const select = document.getElementById('student-name-choice');
        select.innerHTML = '';  // Очищаем список
        students.forEach(student => {
            const option = document.createElement('option');
            option.innerHTML = `${student.Name} ${student.Surname} ${student.Patronymic || ''}`;
            option.value = student.id;
            select.appendChild(option);
        });

    } catch (err) {
        console.error(err);
    }
}


// Загружаем список студентов при загрузке страницы
//window.onload = fetchStudents; // Убедитесь, что эта строка не закомментирована


export default {
    updateStudent,
    deleteStudent,
    addStudent,
    fetchStudents,
    getStudentsList,
    fetchStudentsByGroup
};