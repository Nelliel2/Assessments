'use strict';
//import studentController from '../controllers/studentController.js';
import studentController from '/studentController.js';
import subjectController from '/subjectController.js';
import groupController from '/groupController.js';




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

    updateAssessmentTable();

    let studentsList = await studentController.getStudentsList();
    let subjectsList = await subjectController.getSubjectsList();
    let groupList = await groupController.getGroupsList();
    
    updateSelectBox("student-name-choice", studentsList);
    updateSelectBox("group-name-choice", groupList);
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
    console.log("UpdateTable");
    var table = document.getElementById('assessments-content');


    while(table.firstChild){
        table.removeChild(table.firstChild);
    }
    

    let startDate = document.getElementById("start-period");
    let endDate = document.getElementById("end-period");

    let assessmentColorsClass = [undefined, undefined, "assessment-two", "assessment-three", "assessment-four", "assessment-five"]
    newAssessment(5, new Date("2021-11-02"), assessmentColorsClass[5]);
}

function newAssessment(assessment, asessmentDate, assessmentClassName) {

    let assessmentsList = document.getElementById("assessments-content");
    
    if (!asessmentDate) {
        asessmentDate = document.getElementById("asessment-date").valueAsDate.toLocaleDateString();;
    } else {
        asessmentDate = asessmentDate.toLocaleDateString("ru");
    }
    console.log(asessmentDate);
    let dateElementDiv = document.createElement("div");
    dateElementDiv.classList.add("assessments-content-element");
    let dateDiv = document.createElement("div");
    dateDiv.classList.add("assessments-date");
    dateDiv.textContent = asessmentDate;
    dateElementDiv.appendChild(dateDiv);

    let assessmentElementDiv = document.createElement("div");
    assessmentElementDiv.classList.add("assessments-content-element");
    let assessmentDiv = document.createElement("div");
    assessmentDiv.classList.add("assessments-assessment", assessmentClassName);
    assessmentDiv.textContent = assessment;
    assessmentElementDiv.appendChild(assessmentDiv);

    assessmentsList.appendChild(dateElementDiv);
    assessmentsList.appendChild(assessmentElementDiv);

}

document.addEventListener("DOMContentLoaded", ready);

document.addEventListener('DOMContentLoaded', () => {
    const buttonFive = document.getElementById('assessment-five');
    buttonFive.addEventListener('click',  () => newAssessment(5, false, 'assessment-five'));

    const buttonFour = document.getElementById('assessment-four');
    buttonFour.addEventListener('click',  () => newAssessment(4, false, 'assessment-four'));

    const buttonThree = document.getElementById('assessment-three');
    buttonThree.addEventListener('click',  () => newAssessment(3, false, 'assessment-three'));

    const buttonTwo = document.getElementById('assessment-two');
    buttonTwo.addEventListener('click',  () => newAssessment(2, false, 'assessment-two'));
});