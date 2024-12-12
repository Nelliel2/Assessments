  // sync.js
  import {sequelize} from './db_connection.js';


  import {StudyPlan} from './models/studyPlan.js';
  import {Subject} from './models/subject.js';
  
  import { Group, Assessment, Student, User, Teacher } from './models/internal.js';

  (async () => {
    await sequelize.sync({ force: true });  // Удалит старые таблицы и пересоздаст их
    console.log('Database synced!');
  })();
  