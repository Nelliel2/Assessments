import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db_connection.js';


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
