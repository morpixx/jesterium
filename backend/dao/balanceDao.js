const { db } = require('../config/db');

// Отримання балансу користувача
function getUserBalance(login) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT balance FROM clients WHERE login = ?';
    db.get(sql, [login], (err, row) => {
      if (err) return reject(err);
      resolve(row ? row.balance : 0);
    });
  });
}

// Оновлення балансу користувача
function updateUserBalance(login, amount) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE clients SET balance = balance + ? WHERE login = ?';
    db.run(sql, [amount, login], function(err) {
      if (err) return reject(err);
      resolve({ changes: this.changes });
    });
  });
}

// Перевірка, чи використовував користувач промокод
function checkPromoCodeUsage(login, promoCode) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM promo_code_usages WHERE login = ? AND promo_code = ?';
    db.get(sql, [login, promoCode], (err, row) => {
      if (err) return reject(err);
      resolve(!!row);
    });
  });
}

// Запис використання промокоду користувачем
function recordPromoCodeUsage(login, promoCode) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO promo_code_usages (login, promo_code) VALUES (?, ?)';
    db.run(sql, [login, promoCode], function(err) {
      if (err) return reject(err);
      resolve({ id: this.lastID });
    });
  });
}

// Перевірка, чи використовував користувач будь-який промокод
function hasUsedAnyPromoCode(login) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) as count FROM promo_code_usages WHERE login = ?';
    db.get(sql, [login], (err, row) => {
      if (err) return reject(err);
      resolve(row && row.count > 0);
    });
  });
}

module.exports = {
  getUserBalance,
  updateUserBalance,
  checkPromoCodeUsage,
  recordPromoCodeUsage,
  hasUsedAnyPromoCode
}; 