import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db_connection.js';

//const sequelize = new Sequelize('sqlite::memory:')
const Student = sequelize.define('Subject', {
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Grade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export { Student };
