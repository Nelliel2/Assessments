import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db_connection.js';
import {Assessment} from './assessment.js';
import {User} from './user.js';
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
  GroupId: {  // Обратите внимание на это поле
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Groups', // Укажите модель (таблицу) группы
      key: 'id'  // Укажите ключ в таблице группы
    }
  }
});

export { Student };

