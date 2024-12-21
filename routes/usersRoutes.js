import express from 'express';
import { User } from '../models/internal.js';
import { authenticateToken } from '../middleware/auth.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import session from 'express-session';

const router = express.Router();

const SECRET_KEY = 'your-secret-key';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API для работы с пользователями
 */

/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Добавить нового пользователя
 *     description: Создает нового пользователя в базе данных.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *               Password:
 *                 type: string
 *               StudentId:
 *                 type: integer
 *               TeacherId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Успешно создан.
 *       409:
 *         description: Пользователь уже существует.
 *       500:
 *         description: Ошибка сервера.
 */
router.post('/users', async (req, res) => {
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

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Обновить данные пользователя
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *               Password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Данные успешно обновлены.
 *       404:
 *         description: Пользователь не найден.
 *       500:
 *         description: Ошибка сервера.
 */
router.put('/users/:id', async (req, res) => {
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


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получение всех пользователей
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Список пользователей
 *       500:
 *         description: Ошибка сервера
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Получение пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Информация о пользователе
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.get('/users/:id', async (req, res) => {
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


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Авторизация пользователя
 *     description: Выполняет вход пользователя и генерирует JWT токен
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *                 example: user@example.com
 *               Password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Успешный вход
 *       400:
 *         description: Не указан email или пароль
 *       401:
 *         description: Неправильный пароль
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.post('/login', async (req, res) => {
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

    req.session.role = role;
    req.session.token = token;
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

/**
 * @swagger
 * /check-email:
 *   post:
 *     summary: Проверка существования пользователя по Email
 *     description: Проверяет, существует ли пользователь с указанным Email
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Результат проверки Email
 *       400:
 *         description: Email обязателен
 *       500:
 *         description: Ошибка сервера
 */
router.post('/check-email', async (req, res) => {
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


/**
 * @swagger
 * /check-password/{id}:
 *   post:
 *     summary: Проверка пароля пользователя
 *     description: Сравнивает введённый пароль с паролем пользователя
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Результат проверки пароля
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.post('/check-password/:id', async (req, res) => {

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

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Удаление пользователя
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       204:
 *         description: Пользователь успешно удален
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Находим пользователя по ID
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Удаляем пользователя
    await user.destroy();

    res.status(204).send(); // Успешное удаление
  } catch (err) {
    res.status(500).send(err.message); // Обработка ошибки сервера
  }
});





export default router;