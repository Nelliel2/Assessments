// Функция для получения списка преподавателей
async function fetchTeachers() {
    try {
        const response = await fetch('http://localhost:3000/api/teachers');
        if (!response.ok) {
            throw new Error('Failed to fetch teachers');
        }
        const teachers = await response.json();

        const select = document.getElementById('teacher-name-choice');
        select.innerHTML = '';  // Очищаем список
        teachers.forEach(teacher => {
            const option = document.createElement('option');
            option.innerHTML = `${teacher.Name} ${teacher.Surname} ${teacher.Patronymic || ''}`;
            option.value = teacher.id;
            select.appendChild(option);
        });

    } catch (err) {
        console.error(err);
    }
}


// Функция для получения списка предметов преподавателя
async function getTeacherSubjects(id) {
    try {
        const response = await fetch(`http://localhost:3000/teacher/${id}/subjects`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Если токен нужен для авторизации
            }
        });

        if (!response.ok) {
            throw new Error('Ошибка при получении списка предметов');
        }

        const subjects = await response.json();

        const select = document.getElementById('subject-name-choice');
        if (select) {
            select.innerHTML = '';  // Очищаем список
            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.innerHTML = subject.Name;
                option.value = subject.id;
                select.appendChild(option);
            });
        }

        return subjects;


    } catch (err) {
        console.error('Ошибка при загрузке предметов:', err);
        alert('Ошибка при загрузке предметов. Попробуйте позже.');
    }
}


// Функция для добавления нового преподавателя
async function addTeacher(Name, Surname, Patronymic) {


    if (!Name || !Surname) {
        alert('Please provide both Name and Surname');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/teachers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name: Name, Surname: Surname, Patronymic: Patronymic })
        });

        if (!response.ok) {
            throw new Error('Failed to add teacher');
        }
        const data = await response.json();
        return data.id;
    } catch (err) {
        console.error(err);
        alert('Error adding teacher');
    }
}


// Функция для удаления преподавателя
async function deleteTeacher(id) {
    try {
        const response = await fetch(`http://localhost:3000/teachers/${id}`, { // Исправлен синтаксис URL
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete teacher');
        }

        fetchTeachers();  // Обновляем список преподавателей
    } catch (err) {
        console.error(err);
        alert('Error deleting teacher');
    }
}

// Функция для обновления данных преподавателя
async function updateTeacher(id) {
    const Name = document.getElementById("Name").value;
    const Surname = document.getElementById("Surname").value;
    const Patronymic = document.getElementById("Patronymic").value;

    if (!Name || !Surname) {
        alert('Пожалуйста, укажите имя и фамилию.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/teachers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name, Surname, Patronymic })
        });

        if (!response.ok) {
            throw new Error('Ошибка при изменении данных преподавателя.');
        }

    } catch (err) {
        console.error(err);
        alert('Ошибка при изменении данных преподавателя.');
    }
}


export default {
    updateTeacher,
    deleteTeacher,
    addTeacher,
    fetchTeachers,
    getTeacherSubjects
};