const { sendVerificationEmail } = require('../utils/emailService');
const { generateRandomCode } = require('../services/codeGenerator');
const verificationCodeService = require('../services/verificationCodeService');

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

    // Логіка створення користувача (збереження в таблиці clients)
    // await userService.registerUser({ login, email, password }); // Приклад

    // Генеруємо код підтвердження
    const generatedCode = generateRandomCode();

    // Зберігаємо код у БД
    await verificationCodeService.createVerificationCode(login, generatedCode);

    // Відправляємо код на email
    await sendVerificationEmail(email, generatedCode);

    res.status(201).json({ message: 'Користувача зареєстровано, перевірте вашу пошту.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { registerUser };
