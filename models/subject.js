import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db_connection.js';
import {Assessment} from './assessment.js';

const Subject = sequelize.define('Subject', {
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
Subject.hasMany(Assessment);

export { Subject };

