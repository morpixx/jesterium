const express = require('express');
const router = express.Router();
const promoCodeController = require('../controllers/promoCodeController');
const checkApiToken = require('../middlewares/checkApiToken');
const { promoCodeLimiter } = require('../middlewares/rateLimitMiddleware');

/**
 * @swagger
 * tags:
 *   name: Промокоди
 *   description: Управління промокодами та балансом
 */

/**
 * @swagger
 * /api/promo-codes/validate:
 *   post:
 *     summary: Перевірка валідності промокоду
 *     tags: [Промокоди]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: Промокод для перевірки
 *                 example: Jesterium
 *     responses:
 *       200:
 *         description: Промокод валідний
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: true
 *                 promoCode:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     code:
 *                       type: string
 *                       example: Jesterium
 *                     discount:
 *                       type: integer
 *                       example: 0
 *                     maxUses:
 *                       type: integer
 *                       example: 1000
 *                     currentUses:
 *                       type: integer
 *                       example: 5
 *                     expiryDate:
 *                       type: string
 *                       example: null
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     description:
 *                       type: string
 *                       example: Отримайте 1000 Jesterium монет
 *                     coinReward:
 *                       type: integer
 *                       example: 1000
 *       400:
 *         description: Промокод недійсний
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Промокод не знайдено
 */
router.post('/validate', promoCodeLimiter, promoCodeController.validatePromoCode);

/**
 * @swagger
 * /api/promo-codes/apply:
 *   post:
 *     summary: Застосування промокоду
 *     tags: [Промокоди]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: Промокод для застосування
 *                 example: Jesterium
 *     responses:
 *       200:
 *         description: Промокод успішно застосовано
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 promoCode:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     code:
 *                       type: string
 *                       example: Jesterium
 *                     discount:
 *                       type: integer
 *                       example: 0
 *                     maxUses:
 *                       type: integer
 *                       example: 1000
 *                     currentUses:
 *                       type: integer
 *                       example: 6
 *                     coinReward:
 *                       type: integer
 *                       example: 1000
 *                     appliedReward:
 *                       type: string
 *                       example: Нараховано 1000 Jesterium монет
 *                 balance:
 *                   type: integer
 *                   example: 1000
 *                 message:
 *                   type: string
 *                   example: Нараховано 1000 Jesterium монет
 *       400:
 *         description: Помилка застосування промокоду
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
 *                   example: Для використання промокоду необхідно підключити гаманець
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
router.post('/apply', promoCodeLimiter, checkApiToken, promoCodeController.applyPromoCode);

/**
 * @swagger
 * /api/promo-codes/balance:
 *   get:
 *     summary: Отримання балансу користувача
 *     tags: [Промокоди]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успішно отримано баланс
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 login:
 *                   type: string
 *                   example: user123
 *                 balance:
 *                   type: integer
 *                   example: 1000
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
router.get('/balance', promoCodeLimiter, checkApiToken, promoCodeController.getUserBalance);

/**
 * @swagger
 * /api/promo-codes/balance/{login}:
 *   get:
 *     summary: Отримання балансу за логіном (для адміністратора)
 *     tags: [Промокоди]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: login
 *         required: true
 *         schema:
 *           type: string
 *         description: Логін користувача
 *     responses:
 *       200:
 *         description: Успішно отримано баланс
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 login:
 *                   type: string
 *                   example: user123
 *                 balance:
 *                   type: integer
 *                   example: 1000
 *       401:
 *         description: Необхідна авторизація
 *       403:
 *         description: Недостатньо прав
 */
router.get('/balance/:login', promoCodeLimiter, checkApiToken, promoCodeController.getUserBalance);

/**
 * @swagger
 * /api/promo-codes:
 *   get:
 *     summary: Отримання всіх промокодів (тільки для адміністраторів)
 *     tags: [Промокоди]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список всіх промокодів
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 promoCodes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       code:
 *                         type: string
 *                       discount:
 *                         type: integer
 *                       maxUses:
 *                         type: integer
 *                       currentUses:
 *                         type: integer
 *                       expiryDate:
 *                         type: string
 *                       isActive:
 *                         type: boolean
 *                       description:
 *                         type: string
 *                       coinReward:
 *                         type: integer
 *       401:
 *         description: Необхідна авторизація
 *       403:
 *         description: Недостатньо прав
 */
router.get('/', checkApiToken, promoCodeController.getAllPromoCodes);

/**
 * @swagger
 * /api/promo-codes:
 *   post:
 *     summary: Створення нового промокоду (тільки для адміністраторів)
 *     tags: [Промокоди]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: Унікальний код промокоду
 *               discount:
 *                 type: integer
 *                 description: Знижка у відсотках
 *                 default: 0
 *               maxUses:
 *                 type: integer
 *                 description: Максимальна кількість використань
 *                 default: 1
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 description: Дата закінчення дії (ISO формат)
 *               isActive:
 *                 type: boolean
 *                 description: Чи активний промокод
 *                 default: true
 *               description:
 *                 type: string
 *                 description: Опис промокоду
 *               coinReward:
 *                 type: integer
 *                 description: Кількість монет, які нараховуються при використанні
 *                 default: 0
 *     responses:
 *       201:
 *         description: Промокод успішно створено
 *       401:
 *         description: Необхідна авторизація
 *       403:
 *         description: Недостатньо прав
 */
router.post('/', checkApiToken, promoCodeController.createPromoCode);

/**
 * @swagger
 * /api/promo-codes/{code}/deactivate:
 *   put:
 *     summary: Деактивація промокоду (тільки для адміністраторів)
 *     tags: [Промокоди]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Код промокоду для деактивації
 *     responses:
 *       200:
 *         description: Промокод успішно деактивовано
 *       401:
 *         description: Необхідна авторизація
 *       403:
 *         description: Недостатньо прав
 *       404:
 *         description: Промокод не знайдено
 */
router.put('/:code/deactivate', checkApiToken, promoCodeController.deactivatePromoCode);

/**
 * @swagger
 * /api/promo-codes/{code}:
 *   delete:
 *     summary: Видалення промокоду (тільки для адміністраторів)
 *     tags: [Промокоди]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Код промокоду для видалення
 *     responses:
 *       200:
 *         description: Промокод успішно видалено
 *       401:
 *         description: Необхідна авторизація
 *       403:
 *         description: Недостатньо прав
 *       404:
 *         description: Промокод не знайдено
 */
router.delete('/:code', checkApiToken, promoCodeController.deletePromoCode);

module.exports = router;