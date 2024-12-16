import express from 'express';
import bodyParser from 'body-parser';
import { Op, sequelize } from './db_connection.js';
import { Group, Assessment, Student, User, Teacher, Subject, StudyPlan } from './models/internal.js';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { authenticateToken } from './middleware/auth.js';

import path from 'path';


const SECRET_KEY = 'your-secret-key';
const app = express();
const port = 3000;


const __dirname = path.resolve(); // Получение текущего пути

app.use(express.static(path.join(__dirname, 'controllers')));
app.use(express.static(path.join(__dirname, 'scripts')));
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'modules')));
app.use(express.static(path.join(__dirname, 'img')));

// Отдаём HTML-файл по запросу
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html')); // Путь к файлу
});

app.use(bodyParser.json());

// API для получения списка преподавателей
app.get('/teachers', async (req, res) => {
  console.log('Тело запроса:', req.body);
  try {
    const teachers = await Teacher.findAll();
    res.json(teachers);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// API для добавления нового преподавателя
app.post('/teachers', async (req, res) => {
  console.log('Тело запроса:', req.body);
  const { Name, Surname, Patronymic } = req.body;
  try {
    const teacher = await Teacher.create({ Name, Surname, Patronymic });
    res.status(201).json({ id: teacher.id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API для обновления данных преподавателя
app.put('/teachers/:id', async (req, res) => {
  const { id } = req.params;
  const { Name, Surname, Patronymic } = req.body;
  try {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).send('Teacher not found');
    }
    teacher.Name = Name;
    teacher.Surname = Surname;
    teacher.Patronymic = Patronymic;
    await teacher.save();
    res.status(200).json(teacher);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API для удаления преподавателя
app.delete('/teachers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).send('Teacher not found');
    }
    await teacher.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});


app.get('/teacher/:id/subjects', async (req, res) => {
  const teacherId = req.params.id; 

  try {
    const subjects = await StudyPlan.findAll({
      where: { TeacherId: teacherId },
      include: [
        {
          model: Subject, 
          attributes: ['id', 'Name'] 
        }
      ]
    });

    const result = subjects.map(record => ({
      id: record.Subject.id,
      name: record.Subject.Name
    }));

    res.json(result); 
  } catch (err) {
    console.error('Ошибка при получении предметов учителя:', err);
    res.status(500).json({ message: 'Ошибка при получении предметов учителя' });
  }
});


// API для получения списка студентов
app.get('/students', async (req, res) => {
  console.log('Тело запроса:', req.body);
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Получение студента по ID
app.get('/student/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id, {
      include: [
        {
          model: Group, 
          attributes: ['id', 'Name'] 
        }
      ]
    });

    if (!student) {
      return res.status(404).json({ message: 'Студент не найден' });
    }

    res.status(200).json(student);
  } catch (err) {
    console.error('Ошибка при получении студента:', err);
    res.status(500).json({ message: 'Ошибка при получении студента' });
  }
});



// API для добавления нового студента
app.post('/students', async (req, res) => {
  console.log('Тело запроса:', req.body);
  const { Name, Surname, Patronymic, GroupId } = req.body;  // добавляем GroupId
  try {
    const student = await Student.create({ Name, Surname, Patronymic, GroupId });  // добавляем GroupId при создании
    res.status(201).json({ id: student.id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API для обновления данных студента
app.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  const { Name, Surname, Patronymic } = req.body;  
  try {
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).send('Student not found');
    }
    student.Name = Name;
    student.Surname = Surname;
    student.Patronymic = Patronymic;
    await student.save();
    res.status(200).json(student);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API для удаления студента
app.delete('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).send('Student not found');
    }
    await student.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Функция для получения студентов из конкретной группы
async function fetchStudentsByGroup(GroupId) {
  try {
    const students = await Student.findAll({
      where: { GroupId: GroupId }, // Фильтрация по GroupId
    });
    return students;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error; // Пробрасываем ошибку дальше
  }
}

app.get('/students/group/:GroupId', async (req, res) => {
  const GroupId = req.params.GroupId;

  try {
    const students = await fetchStudentsByGroup(GroupId);
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch students' });
  }
});


// API для получения списка предметов
app.get('/subjects', async (req, res) => {
  try {
    const subjects = await Subject.findAll();
    res.json(subjects);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API для добавления нового предмета
app.post('/subjects', async (req, res) => {
  const { Name } = req.body;
  try {
    const subject = await Subject.create({ Name });
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API для обновления данных предмета
app.put('/subjects/:id', async (req, res) => {
  const { id } = req.params;
  const { Name } = req.body;
  try {
    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).send('Subject not found');
    }
    subject.Name = Name;
    await subject.save();
    res.status(200).json(subject);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API для удаления предмета
app.delete('/subjects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).send('Subject not found');
    }
    await subject.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});



// API для получения списка предметов
app.get('/groups', async (req, res) => {
  try {
    const groups = await Group.findAll();
    res.json(groups);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API для добавления нового предмета
app.post('/groups', async (req, res) => {
  const { Name } = req.body;
  try {
    const group = await Group.create({ Name });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API для обновления данных предмета
app.put('/groups/:id', async (req, res) => {
  const { id } = req.params;
  const { Name } = req.body;
  try {
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).send('Group not found');
    }
    group.Name = Name;
    await group.save();
    res.status(200).json(group);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API для удаления предмета
app.delete('/groups/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).send('Group not found');
    }
    await group.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/groups/:id', authenticateToken, async (req, res) => {
  const groupId = req.params.id;

  try {
    const group = await Group.findByPk(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Группа не найдена' });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error('Ошибка при получении группы:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});


// API для получения всех оценок
app.get('/api/assessments', async (req, res) => {
  try {
    const assessments = await Assessment.findAll();
    res.json(assessments);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API для получения оценок конкретного студента
app.get('/api/students/:studentId/assessments', async (req, res) => {
  const { studentId } = req.params;
  try {
    const assessments = await Assessment.findAll({ where: { StudentId: studentId } });
    res.json(assessments);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API для получения оценок по конкретному предмету
app.get('/api/subjects/:subjectId/assessments', async (req, res) => {
  const { subjectId } = req.params;
  try {
    const assessments = await Assessment.findAll({ where: { SubjectId: subjectId } });
    res.json(assessments);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API для добавления новой оценки
app.post('/api/assessments', async (req, res) => {
  console.log('Тело запроса1:', req.body);
  const { StudentId, SubjectId, Assessment: assessmentValue, Date } = req.body;
  try {
    const newAssessment = await Assessment.create({
      StudentId,
      SubjectId,
      Assessment: assessmentValue,
      Date
    });
    res.status(201).json(newAssessment);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API для обновления оценки по id
app.put('/api/assessments/:id', async (req, res) => {
  const { id } = req.params;
  const { Assessment: newValue, Date: newDate } = req.body;
  try {
    const assessment = await Assessment.findByPk(id);
    if (!assessment) {
      return res.status(404).send('Assessment not found');
    }
    assessment.Assessment = newValue;
    assessment.Date = newDate;
    await assessment.save();
    res.status(200).json(assessment);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API для удаления оценки по id
app.delete('/api/assessments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const assessment = await Assessment.findByPk(id);
    if (!assessment) {
      return res.status(404).send('Assessment not found');
    }
    await assessment.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API для получения оценок студента по предмету с фильтрацией и сортировкой по дате
app.get('/api/assessments/student/:studentId/subject/:subjectId', async (req, res) => {
  const { studentId, subjectId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    // Условие для WHERE
    const whereClause = {
      StudentId: studentId,
      SubjectId: subjectId
    };

    // Если переданы даты, добавляем фильтрацию по дате
    if (startDate && endDate) {
      whereClause.Date = {
        [Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      whereClause.Date = {
        [Op.gte]: startDate
      };
    } else if (endDate) {
      whereClause.Date = {
        [Op.lte]: endDate
      };
    }

    // Получаем оценки студента по предмету с сортировкой по дате
    const assessments = await Assessment.findAll({
      where: whereClause,
      order: [
        [sequelize.literal("STRFTIME('%Y-%m-%d', Date)"), 'ASC'] // Сортировка по дате (возрастание)
      ]
    });

    res.status(200).json(assessments);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});


// API для добавления нового пользователя
app.post('/users', async (req, res) => {
  console.log('Тело запроса:', req.body);
  const { Email, Password, StudentId, TeacherId } = req.body;

  try {
    const existingUser = await User.findOne({ where: { Email } });

    if (existingUser) {
      return res.status(409).json({ error: 'Пользователь с таким Email уже существует' });
    }

    const user = await User.create({ Email, Password, StudentId, TeacherId });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API для обновления данных пользователя
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { Email, Password } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).send('Пользователь не найден.');
    }

    if (Email) { user.Email = Email; }
    if (Password) { user.Password = Password; }
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// API для получения всех пользователей
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// API для получения пользователя по ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).send('Пользователь не найден.');
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// API для авторизации пользователя
app.post('/login', async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res.status(400).json({ error: 'Не указан email или пароль.' });
  }

  try {
    // Ищем пользователя по email
    const user = await User.findOne({ where: { Email } });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден.' });
    }

    // Сравниваем введённый пароль с хэшированным паролем из базы
    const isMatch = await bcrypt.compare(Password, user.Password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Неправильный пароль.' });
    }

    const role = (user.StudentId) ? ("Student") : ("Teacher");

    // Генерируем JWT токен
    const token = jwt.sign(
      { id: user.id, email: user.Email, StudentId: user.StudentId, TeacherId: user.TeacherId, role: role },
      SECRET_KEY,
      { expiresIn: '1h' } // Время жизни токена — 1 час
    );

    res.status(200).json({
      message: 'Успешный вход.',
      token,
      user: { id: user.id, email: user.Email } 
    });
  } catch (err) {
    console.error('Ошибка при авторизации:', err);
    res.status(500).json({ error: 'Ошибка при авторизации' });
  }
});





app.get('/profile', authenticateToken, async (req, res) => {
  try {
    console.log('Данные пользователя из токена:', req.user); // Выводим все, что есть в req.user

    const { id: userId, StudentId, TeacherId, email, role } = req.user;

    let student = null;
    let teacher = null;

    // Проверяем роль пользователя
    if (role === 'Student') {
      if (!StudentId) {
        return res.status(404).json({ message: 'Студент не связан с этим пользователем' });
      }
      student = await Student.findByPk(StudentId);
      if (!student) {
        return res.status(404).json({ message: 'Студент не найден' });
      }
    } else if (role === 'Teacher') {
      if (!TeacherId) {
        return res.status(404).json({ message: 'Учитель не связан с этим пользователем' });
      }
      teacher = await Teacher.findByPk(TeacherId);
      if (!teacher) {
        return res.status(404).json({ message: 'Учитель не найден' });
      }
    } else {
      return res.status(400).json({ message: 'Неизвестная роль пользователя' });
    }

    res.json({
      student,
      teacher,
      user: {
        id: userId,
        email: email,
        role: role
      }
    });
  } catch (err) {
    console.error('Ошибка при получении профиля:', err);
    res.status(500).json({ message: 'Ошибка при получении профиля' });
  }
});



// API для проверки, существует ли пользователь с указанным Email
app.post('/check-email', async (req, res) => {
  const { Email } = req.body;

  if (!Email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Проверяем, существует ли пользователь с таким Email
    const existingUser = await User.findOne({ where: { Email } });

    if (existingUser) {
      return res.status(200).json({ exists: true, message: 'Email уже используется' });
    }

    res.status(200).json({ exists: false, message: 'Email свободен' });
  } catch (err) {
    console.error('Ошибка при проверке email:', err);
    res.status(500).json({ error: 'Ошибка сервера при проверке email' });
  }
});


// API для проверки введенного пароля
app.post('/check-password/:id', async (req, res) => {

  const { id } = req.params;
  const { Password } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Сравниваем введённый пароль с хэшированным паролем из базы
    const isMatch = await bcrypt.compare(Password, user.Password);

    if (!isMatch) {
      return res.status(200).json({ valid: false, message: 'Неверный пароль' });
    }

    return res.status(200).json({ valid: true, message: 'Верный пароль' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});




app.use(express.json()); // Для парсинга JSON-тел запросов

// SSE маршрут
app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Отправка данных каждую секунду
  const intervalId = setInterval(() => {
    const data = JSON.stringify({ message: 'Hello from server!', timestamp: new Date() });
    res.write(`data: ${data}\n\n`);
  }, 1000);

  // Очистка интервала при закрытии соединения
  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
});


// Запуск сервера
app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  try {
    await sequelize.authenticate(); // Проверка подключения
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
