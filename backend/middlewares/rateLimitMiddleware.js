const rateLimit = require('express-rate-limit');

// Загальний обмежувач запитів (15 запитів за 1 хвилину)
const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 хвилина
  max: 15, // Обмеження кожного IP до 15 запитів за вікно
  standardHeaders: true, // Повертає інформацію про ліміт у заголовках `RateLimit-*`
  legacyHeaders: false, // Вимикає застарілі заголовки `X-RateLimit-*`
  message: {
    success: false,
    error: 'Забагато запитів. Спробуйте знову через декілька хвилин.'
  }
});

// Обмежувач для чутливих операцій (5 запитів за 1 хвилину)
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 хвилина
  max: 5, // Обмеження кожного IP до 5 запитів за вікно
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Забагато спроб авторизації. Спробуйте знову через декілька хвилин.'
  }
});

// Обмежувач для API промокодів (10 запитів за 1 хвилину)
const promoCodeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 хвилина
  max: 10, // Обмеження кожного IP до 10 запитів за вікно
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Забагато запитів на використання промокодів. Спробуйте знову через декілька хвилин.'
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  promoCodeLimiter
}; 