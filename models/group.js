import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db_connection.js';

const Group = sequelize.define('Group', {
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export { Group };

