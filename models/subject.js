import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db_connection.js';

const Subject = sequelize.define('Subject', {
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export { Subject };

