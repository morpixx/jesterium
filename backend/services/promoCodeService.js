const promoCodeDao = require('../dao/promoCodeDao');
const balanceDao = require('../dao/balanceDao');
const walletService = require('../services/walletService');

// Перевірка валідності промокоду
async function validatePromoCode(code) {
  if (!code || typeof code !== 'string') {
    throw new Error('Код промокоду має бути непорожнім рядком');
  }
  
  const promoCode = await promoCodeDao.getPromoCodeByCode(code);
  
  if (!promoCode) {
    throw new Error('Промокод не знайдено');
  }
  
  if (!promoCode.isValid()) {
    if (promoCode.currentUses >= promoCode.maxUses) {
      throw new Error('Промокод вже використано максимальну кількість разів');
    }
    if (promoCode.expiryDate && new Date(promoCode.expiryDate) < new Date()) {
      throw new Error('Термін дії промокоду закінчився');
    }
    if (!promoCode.isActive) {
      throw new Error('Промокод неактивний');
    }
    throw new Error('Промокод недійсний');
  }
  
  return promoCode;
}

// Застосування промокоду для користувача
async function applyPromoCode(code, login) {
  if (!login) {
    throw new Error('Необхідно вказати логін користувача');
  }
  
  // Перевірка, чи підключено гаманець
  const walletConnected = await walletService.isWalletConnected(login);
  if (!walletConnected) {
    throw new Error('Для використання промокоду необхідно підключити гаманець');
  }
  
  // Перевірка валідності промокоду
  const promoCode = await validatePromoCode(code);
  
  // Перевірка, чи користувач вже використовував будь-який промокод
  const usedAnyCodes = await balanceDao.hasUsedAnyPromoCode(login);
  if (usedAnyCodes) {
    throw new Error('Ви вже використовували промокод. Можна використати лише один промокод на акаунт');
  }
  
  // Оновлення лічильника використань промокоду
  await promoCodeDao.usePromoCode(code);
  
  // Запис використання промокоду користувачем
  await balanceDao.recordPromoCodeUsage(login, code);
  
  // Нарахування монет на баланс
  if (promoCode.coinReward > 0) {
    await balanceDao.updateUserBalance(login, promoCode.coinReward);
  }
  
  return {
    ...promoCode.toJSON(),
    currentUses: promoCode.currentUses + 1,
    appliedReward: promoCode.coinReward > 0 ? `Нараховано ${promoCode.coinReward} Jesterium монет` : null
  };
}

// Створення нового промокоду
async function createPromoCode(promoCodeData) {
  const { code, discount, maxUses, expiryDate, isActive, description, coinReward } = promoCodeData;
  
  // Валідація даних
  if (!code || typeof code !== 'string') {
    throw new Error('Код промокоду має бути непорожнім рядком');
  }
  
  if (typeof discount !== 'number' || discount < 0) {
    throw new Error('Знижка має бути невід\'ємним числом');
  }
  
  // Перевірка, чи існує промокод з таким кодом
  const existingPromoCode = await promoCodeDao.getPromoCodeByCode(code);
  if (existingPromoCode) {
    throw new Error('Промокод з таким кодом вже існує');
  }
  
  return await promoCodeDao.createPromoCode({
    code,
    discount,
    maxUses,
    expiryDate,
    isActive,
    description,
    coinReward: coinReward || 0
  });
}

// Отримання всіх промокодів
async function getAllPromoCodes() {
  const promoCodes = await promoCodeDao.getAllPromoCodes();
  return promoCodes.map(code => code.toJSON());
}

// Деактивація промокоду
async function deactivatePromoCode(code) {
  const promoCode = await promoCodeDao.getPromoCodeByCode(code);
  if (!promoCode) {
    throw new Error('Промокод не знайдено');
  }
  
  return await promoCodeDao.deactivatePromoCode(code);
}

// Видалення промокоду
async function deletePromoCode(code) {
  const promoCode = await promoCodeDao.getPromoCodeByCode(code);
  if (!promoCode) {
    throw new Error('Промокод не знайдено');
  }
  
  return await promoCodeDao.deletePromoCode(code);
}

// Отримання балансу користувача
async function getUserBalance(login) {
  if (!login) {
    throw new Error('Необхідно вказати логін користувача');
  }
  
  return await balanceDao.getUserBalance(login);
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