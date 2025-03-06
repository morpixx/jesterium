const { db } = require('../config/db');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Отримання користувача за логіном
async function getUserByLogin(login) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM clients WHERE login = ?", [login], (err, row) => {
      if (err) {
        return reject(err);
      }
      // Якщо використовується модель User, перетворіть рядок за допомогою методу fromDb
      if (!row) return resolve(null);
      return resolve(User.fromDb(row));
    });
  });
}

// Створення нового користувача (оновлено для збереження email)
function createUser(userData) {
  return new Promise((resolve, reject) => {
    const { login, email, password, status } = userData;
    const sql = 'INSERT INTO clients (login, email, password, status) VALUES (?, ?, ?, ?)';
    db.run(sql, [login, email, password, status], function(err) {
      if (err) {
        return reject(err);
      }
      resolve({ id: this.lastID, login, email, status });
    });
  });
}

// Оновлення статусу користувача
function updateUserStatus(login, status) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE clients SET status = ? WHERE login = ?';
    db.run(sql, [status, login], function(err) {
      if (err) {
        return reject(err);
      }
      resolve({ changes: this.changes });
    });
  });
}

// Реєстрація нового користувача у вигляді утиліти (з email)
async function registerUser(login, email, password) {
  if (typeof login !== 'string' || login.trim() === '') {
    throw new Error('Login не може бути порожнім');
  }
  if (typeof email !== 'string' || email.trim() === '') {
    throw new Error('Email не може бути порожнім');
  }
  if (typeof password !== 'string' || password.trim() === '') {
    throw new Error('Пароль не може бути порожнім');
  }

  // Перевірка, чи існує користувач з таким логіном
  const existingUser = await getUserByLogin(login);
  if (existingUser) {
    throw new Error('Користувач з таким логіном вже існує');
  }

  // Хешування пароля
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: null,
    login: login.trim(),
    email: email.trim(),
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

  // Перевірка пароля
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Невірний пароль');
  }

  return user;
}

module.exports = { 
  getUserByLogin, 
  createUser, 
  updateUserStatus, 
  registerUser, 
  authenticateUser 
};