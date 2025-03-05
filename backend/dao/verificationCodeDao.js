const { db } = require('../config/db');
const VerificationCode = require('../models/VerificationCode');

// Створення нового коду верифікації
function createVerificationCode(verificationCode) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO verification_codes (generated_code, inputted_code, login, verification_status)
      VALUES (?, ?, ?, ?)
    `;
    db.run(sql, [
      verificationCode.generatedCode,
      verificationCode.inputtedCode,
      verificationCode.login,
      verificationCode.verificationStatus
    ], function (err) {
      if (err) {
        return reject(err);
      }
      verificationCode.id = this.lastID;
      resolve(verificationCode);
    });
  });
}

// Отримання коду за ID
function getVerificationCodeById(id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM verification_codes WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(VerificationCode.fromDb(row));
    });
  });
}

// Отримання останнього запису по login
function getVerificationCodeByLogin(login) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM verification_codes 
      WHERE login = ? 
      ORDER BY id DESC LIMIT 1
    `;
    db.get(sql, [login], (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(VerificationCode.fromDb(row));
    });
  });
}

// Оновлення запису з введеним кодом та новим статусом (наприклад, 'verified')
function updateVerificationCodeInput(login, inputtedCode) {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE verification_codes
      SET inputted_code = ?, verification_status = ?
      WHERE login = ?
    `;
    const newStatus = 'verified';
    db.run(sql, [inputtedCode, newStatus, login], function (err) {
      if (err) {
        return reject(err);
      }
      resolve({ changes: this.changes });
    });
  });
}

module.exports = {
  createVerificationCode,
  getVerificationCodeById,
  getVerificationCodeByLogin,
  updateVerificationCodeInput
};
