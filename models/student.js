import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db_connection.js';
import {Assessment} from './assessment.js';

const Student = sequelize.define('Student', {
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

Student.hasMany(Assessment);


export { Student };
