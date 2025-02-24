const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Підключення middlewares
app.use(express.json());

// Підключення маршрутизаторів
const verificationCodeRoutes = require('./routes/verificationCodeRoutes');
const walletConnectionRoutes = require('./routes/walletConnectionRoutes');
const promoCodeRoutes = require('./routes/promoCodeRoutes');

app.use('/api/verification-codes', verificationCodeRoutes);
app.use('/api/wallet-connections', walletConnectionRoutes);
app.use('/api/promocodes', promoCodeRoutes);

app.listen(port, () => {
  console.log(`Сервер запущено на порту ${port}`);
});