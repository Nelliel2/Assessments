

// Функция для получения списка студентов
async function fetchStudents() {
    try {
        const response = await fetch('http://localhost:3000/api/students'); // Добавлен префикс /api
        if (!response.ok) {
            throw new Error('Failed to fetch students');
        }
        const students = await response.json();

        const select = document.getElementById('student-name-choice');
        if (select) {
            select.innerHTML = '';  // Очищаем список
            students.forEach(student => {
                const option = document.createElement('option');
                option.innerHTML = `${student.Name} ${student.Surname} ${student.Patronymic || ''}`;
                option.value = student.id;
                select.appendChild(option);
            });
        }
    } catch (err) {
        console.error(err);
    }
}

// Функция для получения студента по id 
async function getStudentById(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/student/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Добавляем токен для авторизации
            }
        });

        if (!response.ok) {
            throw new Error('Ошибка при получении данных студента');
        }

        const student = await response.json();

        const selectStudent = document.getElementById('student-name-choice');
        if (selectStudent) {
            selectStudent.innerHTML = '';  // Очищаем список
            const optionStudent = document.createElement('option');
            optionStudent.innerHTML = `${student.Name} ${student.Surname} ${student.Patronymic || ''}`;
            optionStudent.value = student.id;
            selectStudent.appendChild(optionStudent);
        }

        const selectGroup = document.getElementById('group-name-choice');
        if (selectGroup) {
            selectGroup.innerHTML = '';  // Очищаем список
            const optionGroup = document.createElement('option');
            optionGroup.innerHTML = `${student.Group.Name}`;
            optionGroup.value = student.Group.id;
            selectGroup.appendChild(optionGroup);
        };

    } catch (err) {
        console.error('Ошибка при загрузке студента:', err);
        alert('Ошибка при загрузке данных студента. Попробуйте позже.');
    }
}



// Функция для добавления нового студента
async function addStudent(Name, Surname, Patronymic, GroupId) {


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
            body: JSON.stringify({ Name: Name, Surname: Surname, Patronymic: Patronymic, GroupId: GroupId })
        });

        if (!response.ok) {
            throw new Error('Failed to add student');
        }
        const data = await response.json();
        return data.id;
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
    const Name = document.getElementById("Name").value;
    const Surname = document.getElementById("Surname").value;
    const Patronymic = document.getElementById("Patronymic").value;

    if (!Name || !Surname) {
        alert('Пожалуйста, укажите имя и фамилию.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/students/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name, Surname, Patronymic })
        });

        if (!response.ok) {
            throw new Error('Failed to update student');
        }

    } catch (err) {
        console.error(err);
        alert('Error updating student');
    }
}



// Функция для получения списка студентов
async function fetchStudentsByGroup(groupId) {
    try {
        const response = await fetch(`http://localhost:3000/api/students/group/${groupId}`); // Используем groupId в URL
        if (!response.ok) {
            throw new Error('Failed to fetch students');
        }
        const students = await response.json();

        const select = document.getElementById('student-name-choice');
        select.innerHTML = '';  // Очищаем список

        let emptyOption = document.createElement('option');
        emptyOption.selected = true;
        emptyOption.disabled = true;
        emptyOption.hidden = true;
        select.appendChild(emptyOption);

        students.forEach(student => {
            let option = document.createElement('option');
            option.innerHTML = `${student.Name} ${student.Surname} ${student.Patronymic || ''}`;
            option.value = student.id;
            select.appendChild(option);
        });

    } catch (err) {
        console.error(err);
    }
}

export default {
    updateStudent,
    deleteStudent,
    addStudent,
    fetchStudents,
    fetchStudentsByGroup,
    getStudentById
};