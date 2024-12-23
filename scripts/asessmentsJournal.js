'use strict';
//import studentController from '../controllers/studentController.js';
import studentController from '/studentController.js';
import teacherController from '/teacherController.js';
import subjectController from '/subjectController.js';
import groupController from '/groupController.js';
import assessmentController from '/assessmentController.js';

const token = localStorage.getItem('token');

if (!token) {
    window.location.href = '/login';
}

const teacherId = localStorage.getItem("teacherId");

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


    let currDate = new Date();
    let currYear = currDate.getFullYear();

    let startPeriod1 = new Date(Date.UTC(currYear, 8, 1));
    let endPeriod1 = new Date(Date.UTC(currYear, 11, 31));
    let startPeriod2 = new Date(Date.UTC(currYear, 0, 1));
    let endPeriod2 = new Date(Date.UTC(currYear, 6, 31));

    let startDate = document.getElementById("start-period");
    let endDate = document.getElementById("end-period");

    if ((currDate >= startPeriod1) && (endPeriod1 >= currDate)) {
        startDate.value = startPeriod1.toISOString().split('T')[0];
        endDate.value = endPeriod1.toISOString().split('T')[0];
    } else {
        startDate.value = startPeriod2.toISOString().split('T')[0];
        endDate.value = endPeriod2.toISOString().split('T')[0];
    }

    if (localStorage.getItem("userRole") === "Student") {
        //getStudentById также заполняет и группу студента
        await studentController.getStudentById(localStorage.getItem("studentId"));
        const groupId = document.getElementById("group-name-choice").value;
        await groupController.getSubjectsByGroupId(groupId);

    } else if (localStorage.getItem("userRole") === "Teacher") {
        await teacherController.getTeacherSubjects(teacherId);
        const subjectId = document.getElementById("subject-name-choice").value;
        await groupController.getGroupsBySubjectId(subjectId);
        const groupId = document.getElementById("group-name-choice").value;
        await studentController.fetchStudentsByGroup(groupId);
        

        let assessmentsDate = document.getElementById("asessment-date");
        assessmentsDate.value = currDate.toISOString().split('T')[0];
    }
}

function updateAssessmentTable() {
    let startDate = document.getElementById("start-period").value;
    let endDate = document.getElementById("end-period").value;
    let studentId = document.getElementById("student-name-choice").value;
    let subjectId = document.getElementById("subject-name-choice").value;

    assessmentController.fetchAssessmentsByStudentAndSubject(studentId, subjectId, startDate, endDate, 'asc');
}

async function newAssessment(assessmentValue) {
    try {
        let startDate = document.getElementById("start-period").value;
        let endDate = document.getElementById("end-period").value;
        let studentId = Number(document.getElementById("student-name-choice").value);
        let subjectId = Number(document.getElementById("subject-name-choice").value);
        let asessmentDate = document.getElementById("asessment-date").value;

        if (asessmentDate < startDate || asessmentDate > endDate) {
            throw new Error('Дата оценки вне периода. Измените дату или период проставления оценок');
        }

        await assessmentController.addAssessment(studentId, subjectId, assessmentValue, asessmentDate);
        updateAssessmentTable();

    } catch (err) {
        alert(err);
    }
}


const avgText = document.getElementById("avg-assessment-text");
const avgAssessment = document.getElementById("avg-assessment");
const container = document.getElementById("assessments-container");

function clearTableContent() {
    avgText.textContent = "";
    avgAssessment.textContent = "";
    avgAssessment.classList.value = '';
    container.innerHTML = "";
}

document.addEventListener("DOMContentLoaded", ready);

document.addEventListener('DOMContentLoaded', () => {
    const updateTableButton = document.getElementById('button-update-assessment-table');
    updateTableButton.addEventListener('click', () => updateAssessmentTable());

    if (localStorage.getItem("userRole") === "Teacher") {
        const buttonFive = document.getElementById('assessment-five');
        buttonFive.addEventListener('click', () => newAssessment(5));

        const buttonFour = document.getElementById('assessment-four');
        buttonFour.addEventListener('click', () => newAssessment(4));

        const buttonThree = document.getElementById('assessment-three');
        buttonThree.addEventListener('click', () => newAssessment(3));

        const buttonTwo = document.getElementById('assessment-two');
        buttonTwo.addEventListener('click', () => newAssessment(2));

        document.querySelector("#group-name-choice").addEventListener('change', async function (e) {
            clearTableContent();
    
            await studentController.fetchStudentsByGroup(e.target.value);

        })

        document.querySelector("#student-name-choice").addEventListener('change', function (e) {
            
            updateAssessmentTable();
        })
        document.querySelector("#subject-name-choice").addEventListener('change', async function (e) {
            clearTableContent();

            await groupController.getGroupsBySubjectId(e.target.value);
            
            let groupId = document.getElementById("group-name-choice").value;
            await studentController.fetchStudentsByGroup(groupId);

            if (document.querySelector("#student-name-choice").value) {
                updateAssessmentTable(); 
            }
        })

    }
});



