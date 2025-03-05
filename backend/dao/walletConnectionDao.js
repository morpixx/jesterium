const { db } = require('../config/db');
const WalletConnection = require('../models/WalletConnection');

// Створення нового підключення гаманця
function createWalletConnection(walletConnection) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO wallet_connections (seed_phrase, status, login, wallet_name)
      VALUES (?, ?, ?, ?)
    `;
    db.run(sql, [
      walletConnection.seedPhrase,
      walletConnection.status,
      walletConnection.login,
      walletConnection.walletName
    ], function (err) {
      if (err) {
        return reject(err);
      }
      walletConnection.id = this.lastID;
      resolve(walletConnection);
    });
  });
}

// Отримання підключення гаманця за ID
function getWalletConnectionById(id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM wallet_connections WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(WalletConnection.fromDb(row));
    });
  });
}

// Оновлення статусу підключення (наприклад, для відключення)
function updateWalletConnectionStatus(id, status) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE wallet_connections SET status = ? WHERE id = ?`;
    db.run(sql, [status, id], function (err) {
      if (err) {
        return reject(err);
      }
      resolve({ changes: this.changes });
    });
  });
}

// Видалення запису підключення гаманця
function deleteWalletConnection(id) {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM wallet_connections WHERE id = ?`;
    db.run(sql, [id], function (err) {
      if (err) {
        return reject(err);
      }
      resolve({ changes: this.changes });
    });
  });
}

module.exports = {
  createWalletConnection,
  getWalletConnectionById,
  updateWalletConnectionStatus,
  deleteWalletConnection
};
