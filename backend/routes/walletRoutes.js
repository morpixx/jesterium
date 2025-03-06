const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const walletConnectionController = require('../controllers/walletConnectionController');

router.post('/connect', authMiddleware, walletConnectionController.connectWallet);
router.post('/dapp-connect', authMiddleware, walletConnectionController.connectWallet);

module.exports = router;