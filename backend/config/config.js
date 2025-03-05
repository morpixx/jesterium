require('dotenv').config();

// Перевірка наявності критичних змінних середовища
const requiredEnvVars = ['JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  throw new Error(`Відсутні необхідні змінні середовища: ${missingEnvVars.join(', ')}`);
}

module.exports = {
  // Налаштування сервера
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Налаштування бази даних
  database: {
    path: process.env.DB_PATH || './database.db'
  },
  
  // Налаштування JWT
  apiTokenSecret: process.env.JWT_SECRET,
  
  // Налаштування електронної пошти
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    password: process.env.EMAIL_PASSWORD || 'your-app-password'
  },
  
  // Налаштування верифікації
  verification: {
    codeLength: parseInt(process.env.VERIFICATION_CODE_LENGTH || '6', 10),
    codeExpiration: parseInt(process.env.VERIFICATION_CODE_EXPIRATION || '3600', 10) // в секундах
  },

  jwt: {
    secretKey: process.env.JWT_SECRET || 'your-secret-key',
    // Не вказуємо expiresIn, щоб токен був безстроковим
  },

  encryption: {
    saltRounds: 10
  }
};
