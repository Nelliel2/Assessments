

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

// Функция для добавления нового студента
async function addStudent(Name, Surname, Patronymic, GroupId) {


    if (!Name || !Surname) {
        alert('Please provide both Name and Surname');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name: Name, Surname: Surname, Patronymic: Patronymic, GroupId: GroupId})  
        });

        if (!response.ok) {
            throw new Error('Failed to add student');
        }
        const data = await response.json();
        console.log(data);

    } catch (err) {
        console.error(err);
        alert('Error adding student');
    }
}


// Функция для удаления студента
async function deleteStudent(id) {
    try {
        const response = await fetch(`http://localhost:3000/students/${id}`, { // Исправлен синтаксис URL
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
    const Surname = prompt("Enter new Surname:");
    const Patronymic = prompt("Enter new Patronymic:");
    const GroupId = prompt("Enter new GroupId:");  // Добавлено поле GroupId

    if (!Name || !Surname) {
        alert('Please provide valid Name and Surname');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/students/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name, Surname, Patronymic, GroupId })  // Добавлено поле GroupId
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
    fetchStudentsByGroup
};