'use strict';

function validateUserData(req, res, next) {
  const { login, password } = req.body;

  if (!login || typeof login !== 'string' || login.trim().length < 5) {
    return res.status(400).json({ error: 'Login повинен бути рядком з мінімум 5 символів' });
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Password повинен бути рядком з мінімум 8 символів' });
  }

  next();
}

module.exports = { validateUserData };