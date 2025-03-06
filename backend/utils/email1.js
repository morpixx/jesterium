const { sendVerificationCode } = require('../utils/emailService');
const { generateRandomCode } = require('../services/codeGenerator');
const verificationCodeService = require('../services/verificationCodeService');
const userService = require('../services/userService');

async function registerUser(req, res) {
  try {
    const { login, email, password } = req.body;
    // Валідація вхідних даних:
    if (!login || typeof login !== 'string') {
      throw new Error('Login має бути непорожнім рядком');
    }
    if (!email || typeof email !== 'string' || !email.match(/\S+@\S+\.\S+/)) {
      throw new Error('Введіть коректну email адресу');
    }
    if (!password || typeof password !== 'string' || password.trim().length < 6) {
      throw new Error('Пароль має бути не менше 6 символів');
    }

    // 1. Створюємо користувача з початковим статусом "non-verified" (чи "pending")
    const newUser = await userService.registerUser(login, email, password); 
    // (переконайтеся, що ця функція зберігає користувача зі статусом, який забороняє вхід)

    // 2. Генеруємо і зберігаємо код верифікації
    const generatedCode = generateRandomCode();
    await verificationCodeService.createVerificationCode(login, generatedCode);

    // 3. Відправляємо код на email користувача
    await sendVerificationCode(email, generatedCode);

    // Повертаємо повідомлення, що користувача створено (але він не активно увійде, поки не пройде верифікацію)
    res.status(201).json({ 
      message: 'Профіль створено. Перевірте пошту для отримання коду верифікації.',
      user: newUser 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { registerUser };
