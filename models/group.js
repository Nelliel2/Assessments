import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db_connection.js';
import {StudyPlan} from './studyPlan.js';
import {Student} from './student.js';

const Group = sequelize.define('Group', {
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
Group.hasMany(StudyPlan);
// Group.hasMany(Student);

export { Group };

