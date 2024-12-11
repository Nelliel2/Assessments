// Контроллер для управления оценками (Assessments)

// Функция для получения всех оценок
async function fetchAssessments() {
    try {
        const response = await fetch('http://localhost:3000/api/assessments');
        if (!response.ok) {
            throw new Error('Failed to fetch assessments');
        }
        const assessments = await response.json();
        
        // Здесь можно обработать оценки, например, вывести их в таблицу на странице
        console.log('Assessments:', assessments);
    } catch (err) {
        console.error(err);
    }
}

// Функция для добавления новой оценки
async function addAssessment(studentId, subjectId, assessmentValue, date) {
    if (!studentId || !subjectId || !assessmentValue || !date) {
        alert('All fields are required to add an assessment');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/assessments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ studentId, subjectId, Assessment: assessmentValue, Date: date })
        });

        if (!response.ok) {
            throw new Error('Failed to add assessment');
        }

        fetchAssessments(); // Обновляем список оценок
    } catch (err) {
        console.error(err);
        alert('Error adding assessment');
    }
}

// Функция для удаления оценки
async function deleteAssessment(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/assessments/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete assessment');
        }

        fetchAssessments(); // Обновляем список оценок
    } catch (err) {
        console.error(err);
        alert('Error deleting assessment');
    }
}

// Функция для обновления оценки
async function updateAssessment(id) {
    const newAssessmentValue = prompt("Enter new Assessment value (1-100):");
    const newDate = prompt("Enter new Date (YYYY-MM-DD):");

    if (!newAssessmentValue || isNaN(newAssessmentValue) || newAssessmentValue < 1 || newAssessmentValue > 100) {
        alert('Please provide a valid assessment value between 1 and 100');
        return;
    }

    if (!newDate || !/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
        alert('Please provide a valid date in the format YYYY-MM-DD');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/assessments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Assessment: parseInt(newAssessmentValue), Date: newDate })
        });

        if (!response.ok) {
            throw new Error('Failed to update assessment');
        }

        fetchAssessments(); // Обновляем список оценок
    } catch (err) {
        console.error(err);
        alert('Error updating assessment');
    }
}

// Функция для получения оценок студента
async function fetchAssessmentsByStudent(studentId) {
    try {
        const response = await fetch(`http://localhost:3000/api/students/${studentId}/assessments`);
        if (!response.ok) {
            throw new Error('Failed to fetch assessments for student');
        }
        const assessments = await response.json();
        
        // Здесь можно обработать оценки, например, вывести их в таблицу на странице
        console.log(`Assessments for student ${studentId}:`, assessments);
    } catch (err) {
        console.error(err);
    }
}

// Функция для получения оценок по предмету
async function fetchAssessmentsBySubject(subjectId) {
    try {
        const response = await fetch(`http://localhost:3000/api/subjects/${subjectId}/assessments`);
        if (!response.ok) {
            throw new Error('Failed to fetch assessments for subject');
        }
        const assessments = await response.json();
        
        // Здесь можно обработать оценки, например, вывести их в таблицу на странице
        console.log(`Assessments for subject ${subjectId}:`, assessments);
    } catch (err) {
        console.error(err);
    }
}

// Функция для получения оценки ученика по предмету
async function fetchAssessmentByStudentAndSubject(studentId, subjectId) {
    try {
        const response = await fetch(`http://localhost:3000/api/assessments/student/${studentId}/subject/${subjectId}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                alert('Оценка для этого ученика по этому предмету не найдена');
            } else {
                throw new Error('Не удалось получить оценку');
            }
            return;
        }
        
        const assessments = await response.json();
        let container = document.getElementById("assessments-container");
        console.log('Оценка:', assessments);
        let assessmentColorsClass = [undefined, undefined, "assessment-two", "assessment-three", "assessment-four", "assessment-five"]
        
        assessments.forEach(assessment => {
            let row = document.createElement("div");
            row.classList.add("assessments-content", "assessments-row");
        
            let dateElementDiv = document.createElement("div");
            dateElementDiv.classList.add("assessments-content-element");
            let dateDiv = document.createElement("div");
            dateDiv.classList.add("assessments-date");
            dateDiv.textContent = assessment.Date;
            dateElementDiv.appendChild(dateDiv);
        
            let assessmentElementDiv = document.createElement("div");
            assessmentElementDiv.classList.add("assessments-content-element");
            let assessmentDiv = document.createElement("div");
            assessmentDiv.classList.add("assessments-assessment", assessmentColorsClass[assessment.Assessment]);
            assessmentDiv.textContent = assessment.Assessment;
            assessmentElementDiv.appendChild(assessmentDiv);
        
            row.appendChild(dateElementDiv);
            row.appendChild(assessmentElementDiv);
        
            container.appendChild(row);
        });


    } catch (err) {
        console.error('Ошибка при получении оценки:', err.message);
        alert('Ошибка при получении оценки');
    }
}


export default {
    fetchAssessments,
    addAssessment,
    deleteAssessment,
    updateAssessment,
    fetchAssessmentsByStudent,
    fetchAssessmentsBySubject,
    fetchAssessmentByStudentAndSubject
};
