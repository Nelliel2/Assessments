import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your-secret-key';

function authenticateToken(req, res, next) {
  console.log('Заголовки запроса:', req.headers); // Логируем все заголовки
  const authHeader = req.headers['authorization']; // Authorization: Bearer <токен>

  console.log('Заголовок Authorization:', authHeader); // Проверяем, есть ли заголовок

  const token = authHeader && authHeader.split(' ')[1]; // Достаём токен из строки
  console.log('Токен после split:', token); // Проверяем, корректен ли токен

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log('Ошибка при проверке токена:', err);
      return res.status(403).json({ message: 'Invalid token' });
    }
    console.log('Данные пользователя из токена:', user);
    req.user = user; // Сохраняем пользователя в req.user
    next();
  });
}

export { authenticateToken };
