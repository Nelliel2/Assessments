// Функция для получения списка студентов
async function fetchStudents() {

    try {
        const response = await fetch('http://localhost:3000/students');
        if (!response.ok) {
            throw new Error('Failed to fetch students');
        }
        const students = await response.json();
        const list = document.getElementById('student-list');
        list.innerHTML = '';  // Очищаем список
        students.forEach(student => {
            const li = document.createElement('li');
            li.textContent = `${student.Name}: ${student.Surname}`;
            list.appendChild(li);
        });
    } catch (err) {
        console.error(err);
        alert('Error fetching students');
    }
}

// Функция для добавления нового студента
async function addStudent() {
    const Name = document.getElementById('Name').value;
    const Surname = document.getElementById('Surname').value;
    if (!Name || !(Surname)) {
        alert('Please provide both Name and Surname');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name, Surname })
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
        const response = await fetch(`http://localhost:3000/students/${id}`, {
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
    const Surname = parseFloat(prompt("Enter new Surname:"));
    if (!Name || isNaN(Surname)) {
        alert('Please provide valid Name and Surname');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/students/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name, Surname })
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

// Загружаем список студентов при загрузке страницы
//window.onload = fetchStudents;

export default {
    updateStudent,
    deleteStudent,
    addStudent,
    fetchStudents,
};