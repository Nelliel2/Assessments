import {Op, Sequelize} from 'sequelize';
// Создание подключения к базе данных SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db/StudentPortal.db',
});

// Проверка подключения
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

//export { sequelize };


export {Op, sequelize};

// db_connection.js
//export const dbConnection = sequelize;