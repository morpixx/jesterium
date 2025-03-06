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
      email TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('verified', 'non-verified')),
      wallet_status TEXT DEFAULT 'wallet-not-connected' CHECK (wallet_status IN ('wallet-connected', 'wallet-not-connected')),
      balance INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
      login TEXT NOT NULL,
      seed_phrase TEXT,  -- прибрано NOT NULL
      wallet_name TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS promo_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      discount INTEGER NOT NULL,
      max_uses INTEGER DEFAULT 1,
      current_uses INTEGER DEFAULT 0,
      expiry_date TEXT,
      is_active BOOLEAN DEFAULT 1,
      description TEXT,
      coin_reward INTEGER DEFAULT 0
    );
    
    CREATE TABLE IF NOT EXISTS promo_code_usages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      login TEXT NOT NULL,
      promo_code TEXT NOT NULL,
      used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (login) REFERENCES clients(login),
      FOREIGN KEY (promo_code) REFERENCES promo_codes(code),
      UNIQUE(login, promo_code)
    );
  `;
  db.exec(sql, (err) => {
    if (err) {
      console.error('Помилка виконання SQL:', err.message);
    } else {
      console.log('Таблиці створено або вже існують.');
      
      // Додавання стандартних промокодів, якщо вони ще не існують
      insertDefaultPromoCodes();
    }
  });
};

// Функція для додавання стандартних промокодів
const insertDefaultPromoCodes = () => {
  const promoCodes = [
    { code: 'Jesterium', discount: 0, max_uses: 1000, coin_reward: 1000, description: 'Отримайте 1000 Jesterium монет' },
    { code: 'Gift', discount: 0, max_uses: 1000, coin_reward: 1000, description: 'Отримайте 1000 Jesterium монет' },
    { code: 'AirDrop', discount: 0, max_uses: 1000, coin_reward: 1000, description: 'Отримайте 1000 Jesterium монет' }
  ];
  
  promoCodes.forEach(promo => {
    db.get('SELECT * FROM promo_codes WHERE code = ?', [promo.code], (err, row) => {
      if (err) {
        console.error(`Помилка перевірки промокоду ${promo.code}:`, err.message);
        return;
      }
      
      if (!row) {
        db.run(
          'INSERT INTO promo_codes (code, discount, max_uses, coin_reward, description) VALUES (?, ?, ?, ?, ?)',
          [promo.code, promo.discount, promo.max_uses, promo.coin_reward, promo.description],
          err => {
            if (err) {
              console.error(`Помилка додавання промокоду ${promo.code}:`, err.message);
            } else {
              console.log(`Промокод ${promo.code} успішно додано`);
            }
          }
        );
      }
    });
  });
};

module.exports = { db, initDB };