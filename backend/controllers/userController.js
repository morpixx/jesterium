const userService = require('../services/userService');
const { sendVerificationEmail } = require('../utils/emailService');
const { generateRandomCode } = require('../utils/codeGenerator');
const verificationCodeService = require('../services/verificationCodeService');

// Контролер для реєстрації користувача
async function register(req, res) {
  try {
    const { login, password, email } = req.body;
    
    // Реєстрація користувача
    const newUser = await userService.registerUser(login, password);
    
    // Генерація коду верифікації
    const generatedCode = generateRandomCode(6); // Використовуємо 6-значний код для більшої безпеки
    
    // Збереження коду верифікації
    await verificationCodeService.createVerificationCode(login, generatedCode);
    
    // Відправка коду на email
    if (email) {
      await sendVerificationEmail(email, generatedCode);
    }
    
    // Успішна реєстрація повертає статус 201 (Created)
    res.status(201).json({
      message: 'Користувача зареєстровано. Перевірте вашу пошту для верифікації.',
      user: newUser
    });
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
    const result = await userService.loginUser(login, password);
    // Успішна авторизація повертає статус 200 (OK)
    res.status(200).json(result);
  } catch (error) {
    // При помилці повертаємо статус 401 (Unauthorized) і повідомлення про помилку
    res.status(401).json({ error: error.message });
  }
}

module.exports = { register, login };