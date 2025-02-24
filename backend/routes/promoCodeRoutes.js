const express = require('express');
const router = express.Router();
const { redeemPromoCodeController } = require('../controllers/promoCodeController');

// Маршрут для обміну промокоду на коіни
router.post('/redeem', redeemPromoCodeController);

module.exports = router;