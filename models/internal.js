import {Group} from './group.js';
import {Student} from './student.js';
import {Teacher} from './teacher.js';
import {Assessment} from './assessment.js';
import {User} from './user.js';
import {Subject} from './subject.js';
import {StudyPlan} from './studyPlan.js';



Group.hasMany(Student);

Student.hasMany(User);
Teacher.hasMany(User);

Student.hasMany(Assessment);
Subject.hasMany(Assessment);

Subject.hasMany(StudyPlan);
Group.hasMany(StudyPlan);

Student.belongsTo(Group, { foreignKey: 'GroupId' });

Assessment.belongsTo(Subject, { foreignKey: 'SubjectId' });
Assessment.belongsTo(Student, { foreignKey: 'StudentId' });

User.belongsTo(Student, { foreignKey: 'StudentId' });
User.belongsTo(Student, { foreignKey: 'TeacherId' });

StudyPlan.belongsTo(Group, { foreignKey: 'GroupId' });
StudyPlan.belongsTo(Subject, { foreignKey: 'SubjectId' });


export { Group, Assessment, Student, User, Teacher, Subject};