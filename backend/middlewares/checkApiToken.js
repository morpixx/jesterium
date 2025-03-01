const tokenService = require('../services/tokenService');

function checkApiToken(req, res, next) {
  // Токен може передаватись через заголовок Authorization або x-api-token
  const authHeader = req.headers['authorization'] || req.headers['x-api-token'];
  let token;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (authHeader) {
    token = authHeader;
  } else {
    return res.status(401).json({ error: 'API token відсутній' });
  }

  try {
    const decoded = tokenService.verifyToken(token);
    // Збереження інформації про користувача в запиті для подальшого використання
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: error.message });
  }
}

module.exports = checkApiToken; 