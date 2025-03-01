const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Використовуємо конфігурацію замість прямого доступу до process.env
const secretKey = process.env.API_TOKEN_SECRET || 'your_secret_key';

function generateApiToken(user) {
  // Формуємо payload із даними користувача
  const payload = {
    id: user.id,
    login: user.login,
    status: user.status
  };

  // Не вказуємо expiresIn, щоб токен був дійсний безстроково
  const options = {};

  // Генеруємо токен, підписуючи payload за допомогою секретного ключа
  const token = jwt.sign(payload, secretKey, options);
  return token;
}

// Перевірка токена
function verifyToken(token) {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw new Error('Невірний токен');
  }
}

module.exports = { generateApiToken, verifyToken };