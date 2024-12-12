import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../db_connection.js';
import bcrypt from 'bcrypt';

const User = sequelize.define('User', {
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
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

User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.Password, salt);
  user.setDataValue('Password', hashedPassword); // Используем setDataValue
});


export { User };
