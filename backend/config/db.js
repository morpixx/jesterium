// db.js
const sqlite3 = require('sqlite3').verbose();

// Відкриття з'єднання з базою даних (файл database.db буде створено, якщо його немає)
let db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    return console.error('Помилка при з\'єднанні з базою даних:', err.message);
  }
  console.log('З\'єднання з SQLite базою даних встановлено.');
});

// SQL-команди для створення таблиць
const sql = `
DROP TABLE IF EXISTS wallet_connections;
DROP TABLE IF EXISTS verification_codes;
DROP TABLE IF EXISTS clients;

CREATE TABLE clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('verified', 'non-verified'))
);

CREATE TABLE verification_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    generated_code TEXT NOT NULL,
    inputted_code TEXT,
    login TEXT NOT NULL,
    verification_status TEXT DEFAULT 'non-verified' CHECK (verification_status IN ('non-verified', 'verified')),
    FOREIGN KEY (login) REFERENCES clients(login)
);

CREATE TABLE wallet_connections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seed_phrase TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('connected', 'not connected')),
    login TEXT NOT NULL,
    wallet_name TEXT,
    FOREIGN KEY (login) REFERENCES clients(login)
);
`;

// Виконання SQL-команд
db.exec(sql, (err) => {
  if (err) {
    return console.error('Помилка виконання SQL:', err.message);
  }
  console.log('Таблиці створено успішно.');
  
  // Закриття з'єднання з базою даних
  db.close((err) => {
    if (err) {
      return console.error('Помилка при закритті бази даних:', err.message);
    }
    console.log('З\'єднання з базою даних закрито.');
  });
});
