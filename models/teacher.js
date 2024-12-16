import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db_connection.js';

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

export { Teacher };
