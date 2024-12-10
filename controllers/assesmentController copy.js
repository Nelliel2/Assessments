// Функция для получения списка оценок
async function fetchAssessments() {
    try {
        const response = await fetch('http://localhost:3000/api/assessments'); // Добавлен префикс /api
        if (!response.ok) {
            throw new Error('Failed to fetch assessments');
        }
        const assessments = await response.json();

        const select = document.getElementById('assessment-name-choice');
        select.innerHTML = '';  // Очищаем список
        assessments.forEach(assessment => {
            const option = document.createElement('option');
            option.innerHTML = `${assessment.Name} ${assessment.Surname} ${assessment.Patronymic || ''}`;
            option.value = assessment.id;
            select.appendChild(option);
        });

    } catch (err) {
        console.error(err);
    }
}


// Функция для получения массива оценок
async function getAssessmentsList() {
    try {
        const response = await fetch('http://localhost:3000/api/assessments'); // Добавлен префикс /api
        if (!response.ok) {
            throw new Error('Failed to fetch assessments');
        }
        const assessments = await response.json();
        let arr = [];
        assessments.forEach(assessment => {
            arr.push(`${assessment.Name} ${assessment.Surname} ${assessment.Patronymic || ''}`); // Исправлен синтаксис шаблонной строки
        });
        return arr;
    } catch (err) {
        console.error(err);
        alert('Error fetching assessments');
    }
}

// Функция для добавления нового оценки
async function addAssessment() {
    const Name = document.getElementById('Name').value;
    const Surname = document.getElementById('Surname').value;
    const Patronymic = document.getElementById('Patronymic').value; // Добавлено поле Patronymic
    if (!Name || !Surname) {
        alert('Please provide both Name and Surname');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/assessments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name, Surname, Patronymic }) // Добавлено поле Patronymic
        });

        if (!response.ok) {
            throw new Error('Failed to add assessment');
        }

        fetchAssessments();  // Обновляем список оценок
    } catch (err) {
        console.error(err);
        alert('Error adding assessment');
    }
}

// Функция для удаления оценки
async function deleteAssessment(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/assessments/${id}`, { // Исправлен синтаксис URL
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete assessment');
        }

        fetchAssessments();  // Обновляем список оценок
    } catch (err) {
        console.error(err);
        alert('Error deleting assessment');
    }
}

// Функция для обновления данных оценки
async function updateAssessment(id) {
    const Name = prompt("Enter new Name:");
    const Surname = prompt("Enter new Surname:"); // Исправлено на prompt вместо parseFloat
    const Patronymic = prompt("Enter new Patronymic:"); // Добавлено поле Patronymic
    if (!Name || !Surname) {
        alert('Please provide valid Name and Surname');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/assessments/${id}`, { // Исправлен синтаксис URL
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name, Surname, Patronymic }) // Добавлено поле Patronymic
        });

        if (!response.ok) {
            throw new Error('Failed to update assessment');
        }

        fetchAssessments();  // Обновляем список оценок
    } catch (err) {
        console.error(err);
        alert('Error updating assessment');
    }
}


// Функция для получения списка оценок
async function fetchAssessmentsByGroup(groupId) {
    try {
        const response = await fetch(`http://localhost:3000/assessments/group/${groupId}`); // Используем groupId в URL
        if (!response.ok) {
            throw new Error('Failed to fetch assessments');
        }
        const assessments = await response.json();

        const select = document.getElementById('assessment-name-choice');
        select.innerHTML = '';  // Очищаем список
        assessments.forEach(assessment => {
            const option = document.createElement('option');
            option.innerHTML = `${assessment.Name} ${assessment.Surname} ${assessment.Patronymic || ''}`;
            option.value = assessment.id;
            select.appendChild(option);
        });

    } catch (err) {
        console.error(err);
    }
}


// Загружаем список оценок при загрузке страницы
//window.onload = fetchAssessments; // Убедитесь, что эта строка не закомментирована


export default {
    updateAssessment,
    deleteAssessment,
    addAssessment,
    fetchAssessments,
    getAssessmentsList,
    fetchAssessmentsByGroup
};