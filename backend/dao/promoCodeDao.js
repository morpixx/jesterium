const { db } = require('../config/db');
const PromoCode = require('../models/PromoCode');

// Отримання промокоду за кодом
function getPromoCodeByCode(code) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM promo_codes WHERE code = ?';
    db.get(sql, [code], (err, row) => {
      if (err) return reject(err);
      resolve(PromoCode.fromDb(row));
    });
  });
}

// Отримання всіх промокодів
function getAllPromoCodes() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM promo_codes';
    db.all(sql, [], (err, rows) => {
      if (err) return reject(err);
      const promoCodes = rows.map(row => PromoCode.fromDb(row));
      resolve(promoCodes);
    });
  });
}

// Створення нового промокоду
function createPromoCode(promoCodeData) {
  return new Promise((resolve, reject) => {
    const { code, discount, maxUses, expiryDate, isActive, description } = promoCodeData;
    const sql = `
      INSERT INTO promo_codes (code, discount, max_uses, expiry_date, is_active, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(sql, [
      code,
      discount,
      maxUses || 1,
      expiryDate,
      isActive ? 1 : 0,
      description || ''
    ], function(err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, ...promoCodeData });
    });
  });
}

// Оновлення використання промокоду
function usePromoCode(code) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE promo_codes SET current_uses = current_uses + 1 WHERE code = ?';
    db.run(sql, [code], function(err) {
      if (err) return reject(err);
      resolve({ changes: this.changes });
    });
  });
}

// Деактивація промокоду
function deactivatePromoCode(code) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE promo_codes SET is_active = 0 WHERE code = ?';
    db.run(sql, [code], function(err) {
      if (err) return reject(err);
      resolve({ changes: this.changes });
    });
  });
}

// Видалення промокоду
function deletePromoCode(code) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM promo_codes WHERE code = ?';
    db.run(sql, [code], function(err) {
      if (err) return reject(err);
      resolve({ changes: this.changes });
    });
  });
}

module.exports = {
  getPromoCodeByCode,
  getAllPromoCodes,
  createPromoCode,
  usePromoCode,
  deactivatePromoCode,
  deletePromoCode
};
