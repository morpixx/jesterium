// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authLimiter } = require('../middlewares/rateLimitMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Користувачі
 *   description: Управління користувачами і аутентифікація
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Реєстрація нового користувача
 *     tags: [Користувачі]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - email
 *               - password
 *             properties:
 *               login:
 *                 type: string
 *                 description: Логін користувача
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email користувача
 *               password:
 *                 type: string
 *                 description: Пароль користувача
 *     responses:
 *       201:
 *         description: Користувач успішно зареєстрований
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Користувач успішно зареєстрований
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     login:
 *                       type: string
 *                       example: user123
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     status:
 *                       type: string
 *                       example: non-verified
 *       400:
 *         description: Помилка валідації або користувач уже існує
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Користувач з таким логіном вже існує
 */
router.post('/register', authLimiter, userController.register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Вхід користувача
 *     tags: [Користувачі]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - password
 *             properties:
 *               login:
 *                 type: string
 *                 description: Логін користувача
 *               password:
 *                 type: string
 *                 description: Пароль користувача
 *     responses:
 *       200:
 *         description: Успішний вхід
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     login:
 *                       type: string
 *                       example: user123
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     status:
 *                       type: string
 *                       example: verified
 *       401:
 *         description: Невірний логін або пароль
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Невірний логін або пароль
 */
router.post('/login', authLimiter, userController.login);

/**
 * @swagger
 * /api/users/verify-email:
 *   post:
 *     summary: Підтвердження email користувача
 *     tags: [Користувачі]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - code
 *             properties:
 *               login:
 *                 type: string
 *                 description: Логін користувача
 *               code:
 *                 type: string
 *                 description: Код підтвердження email
 *     responses:
 *       200:
 *         description: Email успішно підтверджено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Email успішно підтверджено
 *       400:
 *         description: Неправильний код підтвердження
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Неправильний код підтвердження
 */
router.post('/verify-email', authLimiter, userController.verifyEmail);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Отримання профілю користувача
 *     tags: [Користувачі]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успішно отримано профіль
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     login:
 *                       type: string
 *                       example: user123
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     status:
 *                       type: string
 *                       example: verified
 *                     wallet_status:
 *                       type: string
 *                       example: wallet-connected
 *                     balance:
 *                       type: integer
 *                       example: 1000
 *       401:
 *         description: Необхідна авторизація
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Необхідна авторизація
 */
router.get('/profile', authMiddleware, userController.getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Оновлення профілю користувача
 *     tags: [Користувачі]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Новий email користувача
 *     responses:
 *       200:
 *         description: Профіль успішно оновлено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Профіль успішно оновлено
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     login:
 *                       type: string
 *                       example: user123
 *                     email:
 *                       type: string
 *                       example: newemail@example.com
 *       401:
 *         description: Необхідна авторизація
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Необхідна авторизація
 */
router.put('/profile', authMiddleware, userController.updateProfile);

module.exports = router;