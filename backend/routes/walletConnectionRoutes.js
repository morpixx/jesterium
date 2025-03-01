const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const checkApiToken = require('../middlewares/checkApiToken');

/**
 * @swagger
 * tags:
 *   name: Гаманці
 *   description: Управління криптовалютними гаманцями
 */

/**
 * @swagger
 * /api/wallet-connections/connect:
 *   post:
 *     summary: Підключення криптогаманця через Seed Phrase
 *     tags: [Гаманці]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - seedPhrase
 *             properties:
 *               seedPhrase:
 *                 type: string
 *                 description: Seed Phrase гаманця (12, 18 або 24 слова)
 *               walletName:
 *                 type: string
 *                 description: Назва гаманця (TrustWallet, MetaMask, Phantom)
 *     responses:
 *       200:
 *         description: Гаманець успішно підключено
 *       400:
 *         description: Помилка валідації даних або блокчейну
 *       401:
 *         description: Необхідна авторизація
 */
router.post('/connect', checkApiToken, walletController.connectWallet);

/**
 * @swagger
 * /api/wallet-connections/balance:
 *   get:
 *     summary: Отримання балансу підключеного гаманця
 *     tags: [Гаманці]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Баланс гаманця
 *       400:
 *         description: Помилка при отриманні балансу
 *       401:
 *         description: Необхідна авторизація
 */
router.get('/balance', checkApiToken, walletController.getWalletBalance);

/**
 * @swagger
 * /api/wallet-connections/disconnect:
 *   post:
 *     summary: Відключення гаманця
 *     tags: [Гаманці]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Гаманець успішно відключено
 *       400:
 *         description: Помилка при відключенні гаманця
 *       401:
 *         description: Необхідна авторизація
 */
router.post('/disconnect', checkApiToken, walletController.disconnectWallet);

/**
 * @swagger
 * /api/wallet-connections/status:
 *   get:
 *     summary: Перевірка статусу підключення гаманця
 *     tags: [Гаманці]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Статус гаманця
 *       401:
 *         description: Необхідна авторизація
 */
router.get('/status', checkApiToken, walletController.getWalletStatus);

/**
 * @swagger
 * /api/wallet-connections/errors:
 *   get:
 *     summary: Отримання історії помилок підключення гаманця
 *     tags: [Гаманці]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Історія помилок підключення
 *       401:
 *         description: Необхідна авторизація
 */
router.get('/errors', checkApiToken, walletController.getWalletConnectionErrors);

module.exports = router;
