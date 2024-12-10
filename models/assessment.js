import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db_connection.js';
import { Student } from './student.js';
import { Subject } from './subject.js';

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

Assessment.belongsTo(Student);
Assessment.belongsTo(Subject);

export { Assessment };
