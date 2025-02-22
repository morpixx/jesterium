const express = require('express');
const router = express.Router();
const walletConnectionController = require('../controllers/walletConnectionController');

// Маршрут для підключення гаманця
router.post('/connect', walletConnectionController.connectWallet);

// Маршрут для отримання даних підключення гаманця за ID
router.get('/:id', walletConnectionController.getWalletConnection);

// Маршрут для відключення гаманця (наприклад, оновлення статусу або видалення запису)
router.delete('/:id', walletConnectionController.disconnectWallet);

module.exports = router;
