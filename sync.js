  // sync.js
  import {sequelize} from './db_connection.js';
  import {Student} from './models/student.js';
  import {Assessment} from './models/assessment.js';
  import {Subject} from './models/subject.js';
  
  (async () => {
    await sequelize.sync({ force: true });  // Удалит старые таблицы и пересоздаст их
    console.log('Database synced!');
  })();
  