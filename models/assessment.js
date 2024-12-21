import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db_connection.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Assessment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Уникальный идентификатор оценки
 *         Assessment:
 *           type: integer
 *           description: Значение оценки (балл)
 *         Date:
 *           type: string
 *           format: date-time
 *           description: Дата выставления оценки
 *         SubjectId:
 *           type: integer
 *           description: Идентификатор предмета
 *         StudentId:
 *           type: integer
 *           description: Идентификатор студента
 *       required:
 *         - Assessment
 *         - Date
 *         - SubjectId
 *         - StudentId
 *       example:
 *         id: 1
 *         Assessment: 5
 *         Date: "2024-01-01T12:00:00Z"
 *         SubjectId: 101
 *         StudentId: 202
 */
const Assessment = sequelize.define('Assessment', {
  Assessment: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  SubjectId: {  
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Subjects', 
      key: 'id'
    }
  },
  StudentId: {  
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Students', 
      key: 'id'
    }
  }
});


export { Assessment };
