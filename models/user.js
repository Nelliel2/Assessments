import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db_connection.js';

const User = sequelize.define('User', {
  Login: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export { User };
