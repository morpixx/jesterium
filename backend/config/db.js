// backend/config/db.js
const sqlite3 = require('sqlite3').verbose();

// Створення або відкриття бази даних
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Помилка при з\'єднанні з базою даних:', err.message);
  } else {
    console.log('З\'єднання з SQLite базою даних встановлено.');
  }
});

// Ініціалізація таблиць (створення, якщо їх ще немає)
const initDB = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      login TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('verified', 'non-verified'))
    );
    
    CREATE TABLE IF NOT EXISTS verification_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      generated_code TEXT NOT NULL,
      inputted_code TEXT,
      login TEXT NOT NULL,
      verification_status TEXT DEFAULT 'non-verified' CHECK (verification_status IN ('non-verified', 'verified')),
      FOREIGN KEY (login) REFERENCES clients(login)
    );
    
    CREATE TABLE IF NOT EXISTS wallet_connections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seed_phrase TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('connected', 'not connected')),
      login TEXT NOT NULL,
      wallet_name TEXT,
      FOREIGN KEY (login) REFERENCES clients(login)
    );
  `;
  db.exec(sql, (err) => {
    if (err) {
      console.error('Помилка виконання SQL:', err.message);
    } else {
      console.log('Таблиці створено або вже існують.');
    }
  });
};

initDB();

module.exports = db;