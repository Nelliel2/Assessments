import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db_connection.js';

const Assessment = sequelize.define('Assessment', {
  Assessment: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

export { Assessment };
