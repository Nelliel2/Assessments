import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db_connection.js';

const Student = sequelize.define('Student', {
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
  GroupId: { 
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Groups', 
      key: 'id'  
    }
  }
});

export { Student };

