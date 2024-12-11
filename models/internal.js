import {Group} from './group.js';
import {Student} from './student.js';
import {Assessment} from './assessment.js';


Group.hasMany(Student);
Assessment.belongsTo(Student);
Assessment.belongsTo(Group);

export { Group, Assessment };