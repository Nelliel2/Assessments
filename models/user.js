import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db_connection.js';

const User = sequelize.define('User', {
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  StudentId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'Students', 
      key: 'id'
    }
  },
  TeacherId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'Teachers', 
      key: 'id'
    }
  }
});

export { User };
