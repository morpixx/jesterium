const { sendVerificationCode } = require('../utils/emailService');
const { generateRandomCode } = require('../services/codeGenerator');
const verificationCodeService = require('../services/verificationCodeService');
const userService = require('../services/userService');

async function registerUser(req, res) {
  try {
    const { login, email, password } = req.body;

    // Валідація вхідних даних
    if (!login || typeof login !== 'string') {
      throw new Error('Login має бути непорожнім рядком');
    }
    if (!email || typeof email !== 'string' || !email.match(/\S+@\S+\.\S+/)) {
      throw new Error('Введіть коректну email адресу');
    }
    if (!password || typeof password !== 'string' || password.trim().length < 4) {
      throw new Error('Пароль має бути не менше 6 символів');
    }

    // Логіка створення користувача через userService
    const newUser = await userService.registerUser(login, email, password);

    // Генеруємо код підтвердження
    const generatedCode = generateRandomCode();

    // Зберігаємо код у БД
    await verificationCodeService.createVerificationCode(login, generatedCode);

    // Відправляємо код на email
    await sendVerificationCode(email, generatedCode);

    res.status(201).json({ message: 'Користувача зареєстровано, перевірте вашу пошту.', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { registerUser };
