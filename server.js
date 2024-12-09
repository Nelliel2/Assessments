import express from 'express';
import bodyParser from 'body-parser';
import {sequelize} from './db_connection.js';
import {Student} from './models/student.js';
import {Subject} from './models/subject.js'; 
import {Group} from './models/group.js'; 

import path from 'path';

const app = express();
const port = 3000;



const __dirname = path.resolve(); // Получение текущего пути

app.use(express.static(path.join(__dirname, 'controllers')));
app.use(express.static(path.join(__dirname, 'scripts')));
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'views')));

 // Отдаём HTML-файл по запросу
 app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html')); // Путь к файлу
});


app.use(bodyParser.json());

// API для получения списка студентов
app.get('/students', async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API для добавления нового студента
app.post('/students', async (req, res) => {
  const { Name, Surname, Patronymic } = req.body;
  try {
    const student = await Student.create({ Name, Surname, Patronymic });
    res.status(201).json(student);
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
