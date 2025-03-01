const geoip = require('geoip-lite');

// Список заблокованих країн
const blockedCountries = ['RU', 'UA', 'BY', 'IN'];

// Middleware для геоблокування
function geoBlockingMiddleware(req, res, next) {
  // Отримання IP-адреси
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  // Визначення країни за IP
  const geo = geoip.lookup(ip);
  
  if (geo && blockedCountries.includes(geo.country)) {
    return res.status(403).json({
      success: false,
      error: 'Доступ з вашої країни заблоковано'
    });
  }
  
  next();
}

module.exports = geoBlockingMiddleware; 