import express from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './db_connection.js';
import {Student, Teacher } from './models/internal.js';
import session from 'express-session';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import setupSwagger from './swagger.js';


import { authenticateToken } from './middleware/auth.js';
import studentRoutes from './routes/studentRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import usersRoutes from './routes/usersRoutes.js';

import path from 'path';


const app = express();
const port = 3000;

app.use(express.json());

app.use(session({
  secret: 'your-secret-key', // Нужно закинуть в .env файл
  resave: false,
  saveUninitialized: true
}));

app.use('/api', studentRoutes);
app.use('/api', teacherRoutes);
app.use('/api', subjectRoutes);
app.use('/api', groupRoutes);
app.use('/api', assessmentRoutes);
app.use('/api', usersRoutes);


const __dirname = path.resolve(); // Получение текущего пути

app.use(express.static(path.join(__dirname, 'controllers')));
app.use(express.static(path.join(__dirname, 'scripts')));
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'modules')));
app.use(express.static(path.join(__dirname, 'img')));
app.set('view engine', 'ejs'); // Устанавливаем EJS как шаблонизатор
app.set('views', path.join(__dirname, 'views')); // Устанавливаем папку views для шаблонов

// Отдаём HTML-файл по запросу
app.get('/', (req, res) => {
  res.render(path.join(__dirname, 'views', 'index'), { token: req.session.token }); // Путь к файлу
});

app.use(bodyParser.json());


app.get('/assessmentsJournal', (req, res) => {
  const role = req.session.role; // Получаем роль из сессии
  if (!role) {
    return res.status(403).json({ message: 'Access denied. No role found in session.' });
  }
  res.render('assessmentsJournal', { role }); // Передаём роль в шаблон
});

app.get('/index', (req, res) => {
  res.render('index', { token: req.session.token } ); 
});

app.get('/login', (req, res) => {
  res.render('login'); 
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка выхода' });
    }
    res.clearCookie('connect.sid');  // Удаляем куки сессии
    res.json({ message: 'Выход выполнен' });
  });
});

app.get('/registration', (req, res) => {
  res.render('registration'); 
});

app.get('/profile', (req, res) => {
  const role = req.session.role; // Получаем роль из сессии
  if (!role) {
    return res.status(403).json({ message: 'Access denied. No role found in session.' });
  }
  res.render('profile', { role }); // Передаём роль в шаблон
});

app.get('/api/setDataToToken', authenticateToken, async (req, res) => {
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

// Конфигурация Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API для работы с оценками',
      version: '1.0.0',
      description: 'Документация API для системы учёта оценок',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
    paths: {
      '/api/users': {
        get: {
          summary: 'Получить список пользователей',
          security: [
            {
              BearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: 'Успешный запрос',
            },
            401: {
              description: 'Неавторизованный',
            },
          },
        },
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Dev server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Пути к файлам с API
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

setupSwagger(app); 

// Запуск сервера
app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  try {
    await sequelize.authenticate(); // Проверка подключения
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
