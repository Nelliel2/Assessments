import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db_connection.js';
import { Student } from './student.js';
import { Group } from './group.js';

const Assessment = sequelize.define('Assessment', {
  Assessment: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: false
  }
});


export { Assessment };
