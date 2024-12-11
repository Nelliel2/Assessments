import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db_connection.js';
import {Assessment} from './assessment.js';
import {User} from './user.js';
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
Student.hasMany(User);

export { Student };
