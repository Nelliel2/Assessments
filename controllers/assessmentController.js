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
            // Исправлено: StudentId и SubjectId с заглавной буквы
            body: JSON.stringify({
                StudentId: studentId,
                SubjectId: subjectId,
                Assessment: assessmentValue,
                Date: date
            })
        });

        if (!response.ok) {
            throw new Error('Failed to add assessment');
        }

        console.log('Оценка добавлена успешно');
        // fetchAssessments(); // Обновляем список оценок (раскомментируй, если нужно)
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

        let startDate = document.getElementById("start-period").value;
        let endDate = document.getElementById("end-period").value;

        let studentId = document.getElementById("student-name-choice").value;
        let subjectId = document.getElementById("subject-name-choice").value;

        fetchAssessmentsByStudentAndSubject(studentId, subjectId, startDate, endDate, 'asc');

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

        console.log(`Assessments for subject ${subjectId}:`, assessments);
    } catch (err) {
        console.error(err);
    }
}


// Функция для получения оценок ученика по предмету с фильтрацией и сортировкой
async function fetchAssessmentsByStudentAndSubject(studentId, subjectId, from = null, to = null, sort = 'asc') {
    try {

        let avgText = document.getElementById("avg-assessment-text");
        let avgAssessment = document.getElementById("avg-assessment");
        avgText.textContent = "";
        avgAssessment.textContent = "";
        avgAssessment.classList.value = '';

        const params = new URLSearchParams();
        if (from) params.append('startDate', from);
        if (to) {
            const toDate = new Date(to);
            toDate.setDate(toDate.getDate() + 1); // Добавляем 1 день
            const adjustedTo = toDate.toISOString().split('T')[0]; // Преобразуем обратно в формат YYYY-MM-DD
            params.append('endDate', adjustedTo);
        }
        if (sort) params.append('sort', sort);

        const response = await fetch(`http://localhost:3000/api/assessments/student/${studentId}/subject/${subjectId}?${params}`);

        if (!response.ok) {
            if (response.status === 404) {
                alert('Оценки для этого ученика по этому предмету не найдены');
            } else {
                throw new Error('Не удалось получить оценки');
            }
            return;
        }

        const assessments = await response.json();
        let container = document.getElementById("assessments-container");
        container.innerHTML = "";

        console.log('Оценка:', assessments);
        let assessmentColorsClass = [undefined, undefined, "assessment-two", "assessment-three", "assessment-four", "assessment-five"];
        let sum = 0;

        assessments.forEach(assessment => {
            let row = document.createElement("div");
            row.classList.add("assessments-content", "assessments-row");


            let deleteButton = document.createElement("div");
            deleteButton.classList.add("assessment-delete-button");
            deleteButton.addEventListener('click', (event) => {
                deleteAssessment(assessment.id); // Вызываем функцию удаления
            });

            let dateElementDiv = document.createElement("div");
            dateElementDiv.classList.add("assessments-content-element");
            let dateDiv = document.createElement("div");
            dateDiv.classList.add("assessments-date");
            dateDiv.textContent = new Date(assessment.Date).toLocaleDateString("ru");;
            dateElementDiv.appendChild(dateDiv);

            let assessmentElementDiv = document.createElement("div");
            assessmentElementDiv.classList.add("assessments-content-element");
            let assessmentDiv = document.createElement("div");
            assessmentDiv.classList.add("assessments-assessment", assessmentColorsClass[assessment.Assessment]);
            assessmentDiv.textContent = assessment.Assessment;
            assessmentElementDiv.appendChild(assessmentDiv);

            sum += assessment.Assessment;

            if (localStorage.getItem("userRole") === "Teacher") {
                row.appendChild(deleteButton);
            } else {
                dateElementDiv.style.marginLeft = "35px";
            }
                 
            row.appendChild(dateElementDiv);     
            row.appendChild(assessmentElementDiv);

            container.appendChild(row);
        });


        let avg = assessments.length != 0 ? (sum / assessments.length).toFixed(2) : '';
        if (avg) {
            avgText.textContent = "Средняя оценка за период: ";
            avgAssessment.textContent = avg;
            avgAssessment.classList.value = '';
            avgAssessment.classList.add("assessments-assessment", assessmentColorsClass[Math.round(avg)]);
        }

        //Прокрутка скролла таблицы до конца
        let panel = document.getElementById("assessments-assessment-panel");

        panel.scrollTo({
            top: panel.scrollHeight,
            behavior: 'smooth'
        });


    } catch (err) {
        console.error('Ошибка при получении оценок:', err.message);
        alert('Ошибка при получении оценок');
    }
}




export default {
    fetchAssessments,
    addAssessment,
    deleteAssessment,
    updateAssessment,
    fetchAssessmentsByStudent,
    fetchAssessmentsBySubject,
    fetchAssessmentsByStudentAndSubject
};
