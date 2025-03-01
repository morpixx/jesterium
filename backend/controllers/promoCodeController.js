const promoCodeService = require('../services/promoCodeService');

// Перевірка валідності промокоду
async function validatePromoCode(req, res) {
  try {
    const { code } = req.body;
    const promoCode = await promoCodeService.validatePromoCode(code);
    res.status(200).json({
      valid: true,
      promoCode: promoCode.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      valid: false,
      error: error.message
    });
  }
}

// Застосування промокоду
async function applyPromoCode(req, res) {
  try {
    const { code } = req.body;
    const login = req.user ? req.user.login : req.body.login;
    
    if (!login) {
      return res.status(400).json({
        success: false,
        error: 'Необхідно вказати логін користувача'
      });
    }
    
    const result = await promoCodeService.applyPromoCode(code, login);
    
    // Отримуємо оновлений баланс користувача
    const balance = await promoCodeService.getUserBalance(login);
    
    res.status(200).json({
      success: true,
      promoCode: result,
      balance: balance,
      message: result.appliedReward
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

// Створення нового промокоду
async function createPromoCode(req, res) {
  try {
    const promoCodeData = req.body;
    const newPromoCode = await promoCodeService.createPromoCode(promoCodeData);
    res.status(201).json({
      success: true,
      promoCode: newPromoCode
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

// Отримання всіх промокодів
async function getAllPromoCodes(req, res) {
  try {
    const promoCodes = await promoCodeService.getAllPromoCodes();
    res.status(200).json(promoCodes);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

// Деактивація промокоду
async function deactivatePromoCode(req, res) {
  try {
    const { code } = req.params;
    await promoCodeService.deactivatePromoCode(code);
    res.status(200).json({
      success: true,
      message: 'Промокод деактивовано'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

// Видалення промокоду
async function deletePromoCode(req, res) {
  try {
    const { code } = req.params;
    await promoCodeService.deletePromoCode(code);
    res.status(200).json({
      success: true,
      message: 'Промокод видалено'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

// Отримання балансу користувача
async function getUserBalance(req, res) {
  try {
    const login = req.user ? req.user.login : req.params.login;
    
    if (!login) {
      return res.status(400).json({
        success: false,
        error: 'Необхідно вказати логін користувача'
      });
    }
    
    const balance = await promoCodeService.getUserBalance(login);
    res.status(200).json({
      success: true,
      login: login,
      balance: balance
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = {
  validatePromoCode,
  applyPromoCode,
  createPromoCode,
  getAllPromoCodes,
  deactivatePromoCode,
  deletePromoCode,
  getUserBalance
};