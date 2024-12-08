  // sync.js
  import {sequelize} from './db_connection.js';

  import {Assessment} from './models/assessment.js';
  import {Group} from './models/group.js';
  import {Student} from './models/student.js';
  import {StudentsGroup} from './models/studentsGroup.js';
  import {StudyPlan} from './models/studyPlan.js';
  import {Subject} from './models/subject.js';
  import {Teacher} from './models/teacher.js';
  import {User} from './models/user.js';

  (async () => {
    await sequelize.sync({ force: true });  // Удалит старые таблицы и пересоздаст их
    console.log('Database synced!');
  })();
  