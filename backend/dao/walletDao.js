const { db } = require('../config/db');

// Отримання гаманця за логіном
async function getWalletByLogin(login) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM wallets WHERE login = ?',
      [login],
      (err, row) => {
        if (err) {
          return reject(err);
        }
        if (!row) {
          return resolve(null);
        }
        
        resolve({
          id: row.id,
          login: row.login,
          seedPhrase: row.seed_phrase,
          walletName: row.wallet_name,
          status: row.status,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        });
      }
    );
  });
}

// Збереження даних гаманця
async function saveWallet(login, seedPhrase, walletName, status = 'connected') {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id FROM wallets WHERE login = ?',
      [login],
      (err, row) => {
        if (err) {
          return reject(err);
        }
        
        const now = new Date().toISOString();
        
        if (row) {
          // Оновлення існуючого запису (якщо потрібно зберігати нові дані, наприклад, seedPhrase може бути null)
          db.run(
            'UPDATE wallets SET seed_phrase = ?, wallet_name = ?, status = ?, updated_at = ? WHERE login = ?',
            [seedPhrase, walletName, status, now, login],
            function(err) {
              if (err) {
                return reject(err);
              }
              resolve({
                id: row.id,
                login,
                seedPhrase,
                walletName,
                status,
                createdAt: now,
                updatedAt: now
              });
            }
          );
        } else {
          // Створення нового запису
          db.run(
            'INSERT INTO wallets (login, seed_phrase, wallet_name, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
            [login, seedPhrase, walletName, status, now, now],
            function(err) {
              if (err) {
                return reject(err);
              }
              resolve({
                id: this.lastID,
                login,
                seedPhrase,
                walletName,
                status,
                createdAt: now,
                updatedAt: now
              });
            }
          );
        }
      }
    );
  });
}

// Оновлення статусу гаманця
async function updateWalletStatus(login, status) {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    
    db.run(
      'UPDATE wallets SET status = ?, updated_at = ? WHERE login = ?',
      [status, now, login],
      function(err) {
        if (err) {
          return reject(err);
        }
        
        if (this.changes === 0) {
          return reject(new Error('Гаманець не знайдено'));
        }
        
        resolve({
          login,
          status,
          updatedAt: now
        });
      }
    );
  });
}

// Збереження помилки підключення гаманця
async function saveWalletConnectionError(login, walletName, errorType, errorMessage) {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    
    db.run(
      'INSERT INTO wallet_connection_errors (login, wallet_name, error_type, error_message, created_at) VALUES (?, ?, ?, ?, ?)',
      [login, walletName, errorType, errorMessage, now],
      function(err) {
        if (err) {
          return reject(err);
        }
        
        resolve({
          id: this.lastID,
          login,
          walletName,
          errorType,
          errorMessage,
          createdAt: now
        });
      }
    );
  });
}

// Отримання історії помилок підключення гаманця
async function getWalletConnectionErrors(login) {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM wallet_connection_errors WHERE login = ? ORDER BY created_at DESC',
      [login],
      (err, rows) => {
        if (err) {
          return reject(err);
        }
        
        resolve(rows.map(row => ({
          id: row.id,
          login: row.login,
          walletName: row.wallet_name,
          errorType: row.error_type,
          errorMessage: row.error_message,
          createdAt: row.created_at
        })));
      }
    );
  });
}

module.exports = {
  getWalletByLogin,
  saveWallet,
  updateWalletStatus,
  saveWalletConnectionError,
  getWalletConnectionErrors
};