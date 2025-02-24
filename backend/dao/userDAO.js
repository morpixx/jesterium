// backend/dao/userDao.js
const db = require('../config/db');
const userService = require('../services/userService');

// Отримання користувача за логіном
const getUserByLogin = (login, callback) => {
  const sql = 'SELECT * FROM users WHERE login = ?';
  db.get(sql, [login], (err, row) => {
    callback(err, row);
  });
};

// Створення нового користувача
const createUser = (userData, callback) => {
  const { login, password, status } = userData;
  const sql = 'INSERT INTO users (login, password, status) VALUES (?, ?, ?)';
  db.run(sql, [login, password, status], function(err) {
    callback(err, { id: this.lastID });
  });
};

// Реєстрація нового користувача
async function registerUser(login, password) {
  if (typeof login !== 'string' || login.trim() === '') {
    throw new Error('Login не може бути порожнім');
  }
  if (typeof password !== 'string' || password.trim() === '') {
    throw new Error('Пароль не може бути порожнім');
  }

  // Перевірка, чи існує користувач з таким логіном
  const existingUser = await getUserByLogin(login);
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

  return await createUser(newUser);
}

// Аутентифікація користувача
async function authenticateUser(login, password) {
  if (typeof login !== 'string' || login.trim() === '') {
    throw new Error('Login не може бути порожнім');
  }
  if (typeof password !== 'string' || password.trim() === '') {
    throw new Error('Пароль не може бути порожнім');
  }

  const user = await getUserByLogin(login);
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

// Контролер для реєстрації користувача
async function register(req, res) {
  try {
    const { login, password } = req.body;
    // Викликаємо сервіс для реєстрації користувача
    const newUser = await userService.registerUser(login, password);
    // Успішна реєстрація повертає статус 201 (Created)
    res.status(201).json(newUser);
  } catch (error) {
    // При помилці повертаємо статус 400 (Bad Request) і повідомлення про помилку
    res.status(400).json({ error: error.message });
  }
}

// Контролер для авторизації користувача
async function login(req, res) {
  try {
    const { login, password } = req.body;
    // Викликаємо сервіс для авторизації користувача
    const user = await userService.loginUser(login, password);
    // Успішна авторизація повертає статус 200 (OK)
    res.status(200).json(user);
  } catch (error) {
    // При помилці повертаємо статус 401 (Unauthorized) і повідомлення про помилку
    res.status(401).json({ error: error.message });
  }
}

module.exports = { getUserByLogin, createUser, register, login };