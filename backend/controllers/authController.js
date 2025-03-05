const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

async function login(req, res) {
  try {
    const { login, password } = req.body;
    const user = await userService.loginUser(login, password);
    if (!user) {
      return res.status(401).json({ error: 'Невірний логін або пароль' });
    }
    // Генерируем токен, включающий данные пользователя
    const token = jwt.sign({ id: user.id, login: user.login }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { login };