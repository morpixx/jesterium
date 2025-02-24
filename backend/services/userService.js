const userDao = require('../dao/userDAO');
const bcrypt = require('bcrypt');

// Реєстрація нового користувача
async function registerUser(login, password) {
  if (typeof login !== 'string' || login.trim() === '') {
    throw new Error('Login не може бути порожнім');
  }
  if (typeof password !== 'string' || password.trim() === '') {
    throw new Error('Пароль не може бути порожнім');
  }

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
async function authenticateUser(login, password) {
  if (typeof login !== 'string' || login.trim() === '') {
    throw new Error('Login не може бути порожнім');
  }
  if (typeof password !== 'string' || password.trim() === '') {
    throw new Error('Пароль не може бути порожнім');
  }

  const user = await userDao.getUserByLogin(login);
  if (!user) {
    throw new Error('Користувача з таким логіном не знайдено');
  }

  // Перевірка введеного пароля з хешованим в базі
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Невірний пароль');
  }

  return user;
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

module.exports = {
  registerUser,
  authenticateUser,
  getUserByLogin,
  updateUserStatus
};