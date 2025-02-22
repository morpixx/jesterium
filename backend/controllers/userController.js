const userService = require('../services/userService');

// Контролер для реєстрації користувача
async function register(req, res) {
  try {
    const { login, password } = req.body;
    // Викликаємо сервіс для реєстрації користувача
    const newUser = await userService.registerUser(login, password);
    // Успішна реєстрація повертає статус 201 (Created)
    res.status(201).json(newUser);
  } catch (error) {
    // При помилці повертаємо статус 400 (Bad Request) і повідомлення про помилку
    res.status(400).json({ error: error.message });
  }
}

// Контролер для авторизації користувача
async function login(req, res) {
  try {
    const { login, password } = req.body;
    // Викликаємо сервіс для авторизації користувача
    const user = await userService.loginUser(login, password);
    // Успішна авторизація повертає статус 200 (OK)
    res.status(200).json(user);
  } catch (error) {
    // При помилці повертаємо статус 401 (Unauthorized) і повідомлення про помилку
    res.status(401).json({ error: error.message });
  }
}

module.exports = { register, login };