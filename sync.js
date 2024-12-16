// sync.js
import { sequelize } from './db_connection.js';

import { Group, Assessment, Student, User, Teacher, Subject, StudyPlan } from './models/internal.js';

(async () => {
  await sequelize.sync({ force: true });  // Удалит старые таблицы и пересоздаст их
  console.log('Database synced!');
})();
