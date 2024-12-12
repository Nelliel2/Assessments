'use strict';
//import studentController from '../controllers/studentController.js';
import studentController from '/studentController.js';
import subjectController from '/subjectController.js';
import groupController from '/groupController.js';
import assessmentController from '/assessmentController.js';




async function ready() {
    let currDate = new Date();
    let assessmentsDate = document.getElementById("asessment-date");
    console.dir(assessmentsDate);
    assessmentsDate.value = currDate.toISOString().split('T')[0];

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



    await subjectController.fetchSubjects();
    await groupController.fetchGroups();
    let GroupId = document.getElementById("group-name-choice").value;
    await studentController.fetchStudentsByGroup(GroupId);


    //updateAssessmentTable();

    //let studentsList = await studentController.getStudentsList();
    //let subjectsList = await subjectController.getSubjectsList();
    //let groupList = await groupController.getGroupsList();

    //updateSelectBox("student-name-choice", studentsList);
    //updateSelectBox("group-name-choice", groupList);
}

function updateSelectBox(id, options) {
    var select = document.getElementById(id);

    // очистка списка
    while (select.options.length > 0) {
        select.options.remove(0);
    }

    // заполнение списка
    for (var i = 0; i < options.length; i++) {
        var option = document.createElement('option');
        option.value = i;
        option.text = options[i];
        select.options.add(option);
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

document.addEventListener("DOMContentLoaded", ready);

document.addEventListener('DOMContentLoaded', () => {
    const buttonFive = document.getElementById('assessment-five');
    buttonFive.addEventListener('click', () => newAssessment(5));

    const buttonFour = document.getElementById('assessment-four');
    buttonFour.addEventListener('click', () => newAssessment(4));

    const buttonThree = document.getElementById('assessment-three');
    buttonThree.addEventListener('click', () => newAssessment(3));

    const buttonTwo = document.getElementById('assessment-two');
    buttonTwo.addEventListener('click', () => newAssessment(2));


    const updateTableButton = document.getElementById('button-update-assessment-table');
    updateTableButton.addEventListener('click', () => updateAssessmentTable());

    document.querySelector("#group-name-choice").addEventListener('change', function (e) {
        studentController.fetchStudentsByGroup(e.target.value);
        var table = document.getElementById('assessments-container');
        table.innerHTML = "";
    })

    document.querySelector("#student-name-choice").addEventListener('change', function (e) {
        updateAssessmentTable();
    })
    document.querySelector("#subject-name-choice").addEventListener('change', function (e) {
        if (document.querySelector("#student-name-choice").value) {
            updateAssessmentTable();
        }
    })


});


