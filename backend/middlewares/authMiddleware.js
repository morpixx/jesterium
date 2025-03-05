const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || req.headers['x-api-token'];
  console.log("Отриманий authHeader:", authHeader);
  
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  if (!token) {
    console.log("Токен не отримано");
    return res.status(401).json({ error: 'Необхідна авторизація' });
  }

  try {
    // Тепер використовуємо JWT_SECRET для перевірки
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Помилка перевірки токена:", error);
    return res.status(401).json({ error: 'Необхідна авторизація' });
  }
}

module.exports = authMiddleware;