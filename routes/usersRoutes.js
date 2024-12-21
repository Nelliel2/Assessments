import express from 'express';
import { User } from '../models/internal.js';
import { authenticateToken } from '../middleware/auth.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import session from 'express-session';

const router = express.Router();

const SECRET_KEY = 'your-secret-key';

// API для добавления нового пользователя
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
  
  // API для обновления данных пользователя
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
  
  
  // API для получения всех пользователей
  router.get('/users', async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  
  // API для получения пользователя по ID
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
  
  
  // API для авторизации пользователя
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
  
  // API для проверки, существует ли пользователь с указанным Email
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
  
  
  // API для проверки введенного пароля
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

  export default router;