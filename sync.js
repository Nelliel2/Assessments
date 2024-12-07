  // sync.js
  import {sequelize} from './db_connection.js';
  import {Student} from './models/student.js';
  
  (async () => {
    await sequelize.sync({ force: true });  // Удалит старые таблицы и пересоздаст их
    console.log('Database synced!');
  })();
  