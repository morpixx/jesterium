const config = require('../config/config');

function errorHandler(err, req, res, next) {
  // Логування помилки
  console.error(`[${new Date().toISOString()}] Error:`, err);
  
  // Визначення статус-коду
  const statusCode = err.statusCode || 500;
  
  // Формування відповіді
  const response = {
    error: err.message || 'Внутрішня помилка сервера'
  };
  
  // Додавання стеку помилки в режимі розробки
  if (config.nodeEnv === 'development') {
    response.stack = err.stack;
  }
  
  res.status(statusCode).json(response);
}

module.exports = errorHandler;
