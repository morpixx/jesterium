const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');
const config = require('./config/config');
const db = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const geoBlockingMiddleware = require('./middlewares/geoBlockingMiddleware');
const { generalLimiter, authLimiter, promoCodeLimiter } = require('./middlewares/rateLimitMiddleware');
const port = process.env.PORT || 3001;

// Ініціалізація бази даних
db.initDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Геоблокування
app.use(geoBlockingMiddleware);

// Загальне обмеження швидкості для всіх маршрутів
app.use(generalLimiter);

// Swagger документація
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Jesterium API Documentation'
}));

// Підключення маршрутизаторів
const userRoutes = require('./routes/userRoutes');
const verificationCodeRoutes = require('./routes/verificationCodeRoutes');
const walletConnectionRoutes = require('./routes/walletConnectionRoutes');
const promoCodeRoutes = require('./routes/promoCodeRoutes');
const walletRoutes = require('./routes/walletRoutes');

// Використання маршрутів
app.use('/api/users', userRoutes);
app.use('/api/verification-codes', verificationCodeRoutes);
app.use('/api/wallet-connections', walletRoutes);
app.use('/api/promo-codes', promoCodeRoutes);

// Обробка помилок
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Сервер запущено на порту ${port}`);
  console.log(`Swagger документація доступна за адресою: http://localhost:${port}/api-docs`);
});

module.exports = app;