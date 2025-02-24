const jwt = require('jsonwebtoken');

const secretKey = process.env.API_TOKEN_SECRET || 'your_secret_key';

function generateApiToken(user) {
  // Формуємо payload із даними користувача. 
  // Ви можете додавати інші поля, якщо вони потрібні.
  const payload = {
    id: user.id,
    login: user.login
  };

  // Опції можна налаштувати, наприклад, вказати час дії токену.
  const options = {
    expiresIn: '1h' // токен дійсний протягом 1 години
  };

  // Генеруємо токен, підписуючи payload за допомогою секретного ключа.
  const token = jwt.sign(payload, secretKey, options);
  return token;
}

module.exports = generateApiToken;