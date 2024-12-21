
// Функция для получения списка предметов
async function fetchSubjects() {
    try {
        const response = await fetch('http://localhost:3000/api/subjects');
        if (!response.ok) {
            
            let select = document.getElementById('Subject');
            if (select) {
                select.innerHTML = '';
            }
            select = document.getElementById('subject');
            if (select) {
                select.innerHTML = '';
            }
            throw new Error('Failed to fetch subjects');
        }
        const subjects = await response.json();
        let select = document.getElementById('Subject');
        if (select) {
            select.innerHTML = '';  // Очищаем список
            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.innerHTML = subject.Name;
                option.value = subject.id;
                select.appendChild(option);
            });
        }

        select = document.getElementById('subject');
        if (select) {
            select.innerHTML = '';  // Очищаем список
            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.innerHTML = subject.Name;
                option.value = subject.id;
                select.appendChild(option);
            });
        }
    } catch (err) {
        console.error(err);
        alert('Error fetching subjects');
    }
}

// Функция для получения массива студентов
async function getSubjectsList() {

    try {
        const response = await fetch('http://localhost:3000/api/subjects');
        if (!response.ok) {
            throw new Error('Failed to fetch subjects');
        }
        const subjects = await response.json();
        let arr = []
        subjects.forEach(subject => {
            arr.push(`${subject.Name}`);
        });
        return arr;
    } catch (err) {
        console.error(err);
        alert('Error fetching subjects');
    }
}

// Функция для добавления нового предмета
async function addSubject() {
    const Name = document.getElementById('Name').value;
    if (!Name) {
        alert('Please provide a Name for the subject');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/subjects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name })
        });

        if (!response.ok) {
            throw new Error('Failed to add subject');
        }

        fetchSubjects();  // Обновляем список предметов
    } catch (err) {
        console.error(err);
        alert('Error adding subject');
    }
}

// Функция для удаления предмета
async function deleteSubject(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/subjects/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete subject');
        }

        fetchSubjects();  // Обновляем список предметов
    } catch (err) {
        console.error(err);
        alert('Error deleting subject');
    }
}

// Функция для обновления данных предмета
async function updateSubject(id) {
    const Name = prompt("Enter new Name for the subject:");
    if (!Name) {
        alert('Please provide a valid Name');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/subjects/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name })
        });

        if (!response.ok) {
            throw new Error('Failed to update subject');
        }

        fetchSubjects();  // Обновляем список предметов
    } catch (err) {
        console.error(err);
        alert('Error updating subject');
    }
}

// Загружаем список предметов при загрузке страницы
window.onload = fetchSubjects;

export default {
    updateSubject,
    deleteSubject,
    addSubject,
    fetchSubjects,
    getSubjectsList
};
