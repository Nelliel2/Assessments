import {Group} from './group.js';
import {Student} from './student.js';
import {Teacher} from './teacher.js';
import {Assessment} from './assessment.js';
import {User} from './user.js';



Group.hasMany(Student);
Student.belongsTo(Group, { foreignKey: 'GroupId' });
Student.hasMany(Assessment);
Student.hasMany(User);
Teacher.hasMany(User);
Assessment.belongsTo(Student);
Assessment.belongsTo(Group);


User.belongsTo(Student, { foreignKey: 'StudentId' });
User.belongsTo(Student, { foreignKey: 'TeacherId' });


export { Group, Assessment, Student, User, Teacher};