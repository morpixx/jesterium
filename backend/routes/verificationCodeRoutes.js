const express = require('express');
const router = express.Router();
const verificationCodeController = require('../controllers/verificationCodeController');

// Маршрут для створення нового коду верифікації
router.post('/create', verificationCodeController.createVerificationCode);

// Маршрут для перевірки коду верифікації
router.post('/verify', verificationCodeController.verifyCode);

// Маршрут для отримання даних коду за ID
router.get('/:id', verificationCodeController.getVerificationCodeById);

module.exports = router;
