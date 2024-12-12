import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db_connection.js';
import {StudyPlan} from './studyPlan.js';
import {User} from './user.js';

const Teacher = sequelize.define('Teacher', {
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Surname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Patronymic: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Teacher.hasMany(StudyPlan);

export { Teacher };
