import express from 'express';
import bodyParser from 'body-parser';
import {sequelize} from './db_connection.js';
import {Student} from './models/student.js';
import path from 'path';

const app = express();
const port = 3000;


const __dirname = path.resolve(); // Получение текущего пути
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
  const { Name, Grade } = req.body;
  try {
    const student = await Student.create({ Name, Grade });
    res.status(201).json(student);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API для обновления данных студента
app.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  const { Name, Grade } = req.body;
  try {
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).send('Student not found');
    }
    student.Name = Name;
    student.Grade = Grade;
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

// Запуск сервера
app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  try {
    await sequelize.authenticate(); // Проверка подключения
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
