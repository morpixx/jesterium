const userDao = require('../dao/userDao');
const bcrypt = require('bcrypt');
const tokenService = require('./tokenService');

// Реєстрація нового користувача
async function registerUser(login, password) {
  // Валідація вхідних даних
  validateUserInput(login, password);

  // Перевірка, чи існує користувач з таким логіном
  const existingUser = await userDao.getUserByLogin(login);
  if (existingUser) {
    throw new Error('Користувач з таким логіном вже існує');
  }

  // Хешування пароля для безпечного зберігання
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: null,
    login: login.trim(),
    password: hashedPassword,
    status: 'non-verified'
  };

  return await userDao.createUser(newUser);
}

// Аутентифікація користувача
async function loginUser(login, password) {
  // Валідація вхідних даних
  validateUserInput(login, password);

  const user = await userDao.getUserByLogin(login);
  if (!user) {
    throw new Error('Користувача з таким логіном не знайдено');
  }

  // Перевірка введеного пароля з хешованим в базі
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Невірний пароль');
  }

  // Генерація токена для авторизованого користувача
  const token = tokenService.generateApiToken(user);
  
  // Повертаємо дані користувача та токен
  return {
    user: user.toJSON(),
    token
  };
}

// Отримання даних користувача за логіном
async function getUserByLogin(login) {
  if (typeof login !== 'string' || login.trim() === '') {
    throw new Error('Login не може бути порожнім');
  }
  return await userDao.getUserByLogin(login);
}

// Оновлення статусу користувача (наприклад, після верифікації)
async function updateUserStatus(login, status) {
  if (status !== 'verified' && status !== 'non-verified') {
    throw new Error('Неправильний статус користувача');
  }
  return await userDao.updateUserStatus(login, status);
}

// Допоміжна функція для валідації вхідних даних
function validateUserInput(login, password) {
  if (typeof login !== 'string' || login.trim().length < 5) {
    throw new Error('Login повинен бути рядком з мінімум 5 символів');
  }
  if (typeof password !== 'string' || password.length < 8) {
    throw new Error('Password повинен бути рядком з мінімум 8 символів');
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUserByLogin,
  updateUserStatus
};