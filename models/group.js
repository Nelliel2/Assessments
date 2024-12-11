import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db_connection.js';
import {StudyPlan} from './studyPlan.js';
import {Students} from './students.js';

const Group = sequelize.define('Group', {
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
Group.hasMany(StudyPlan);
Group.hasMany(Students);

export { Group };

