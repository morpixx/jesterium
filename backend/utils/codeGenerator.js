const crypto = require('crypto');

// Генерація випадкового коду заданої довжини
function generateRandomCode(length = 6) {
  // Використовуємо crypto для більш безпечної генерації
  if (length <= 0) {
    throw new Error('Довжина коду повинна бути більше 0');
  }
  
  // Для простих числових кодів
  if (length <= 10) {
    let code = '';
    const chars = '0123456789';
    for (let i = 0; i < length; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }
  
  // Для довших кодів використовуємо crypto
  return crypto.randomBytes(Math.ceil(length/2))
    .toString('hex')
    .slice(0, length);
}

module.exports = { generateRandomCode };
