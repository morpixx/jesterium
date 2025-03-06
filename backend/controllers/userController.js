const userService = require('../services/userService');
const { sendVerificationEmail } = require('../utils/emailService');
const { generateRandomCode } = require('../utils/codeGenerator');
const verificationCodeService = require('../services/verificationCodeService');

// Контролер для реєстрації користувача
async function register(req, res) {
  try {
    const { login, password, email } = req.body;
    
    // Реєстрація користувача (передаємо login, email та password)
    const newUser = await userService.registerUser(login, email, password);
    
    // Генерація 6-значного коду верифікації
    const generatedCode = generateRandomCode(6);
    
    // Збереження коду верифікації
    await verificationCodeService.createVerificationCode(login, generatedCode);
    
    // Відправка коду на email (якщо email вказано)
    if (email) {
      await sendVerificationEmail(email, generatedCode);
    }
    
    res.status(201).json({
      message: 'Користувача зареєстровано. Перевірте вашу пошту для верифікації.',
      user: newUser
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Контролер для авторизації користувача
async function login(req, res) {
  try {
    const { login, password } = req.body;
    const result = await userService.loginUser(login, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

// Контролер для верифікації email
async function verifyEmail(req, res) {
  try {
    const { login, code } = req.body;
    const isVerified = await verificationCodeService.verifyCode(login, code);
    if (isVerified) {
      res.status(200).json({
        success: true,
        message: 'Email успішно підтверджено'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Невірний код підтвердження'
      });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

// Контролер для отримання профілю користувача
async function getProfile(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Необхідна авторизація' });
    }
    // Отримати повну інформацію користувача з бази даних, включаючи email
    const user = await userService.getUserByLogin(req.user.login);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Контролер для оновлення профілю користувача (наприклад, email)
async function updateProfile(req, res) {
  try {
    const { email } = req.body;
    if (!req.user || !req.user.login) {
      return res.status(401).json({ error: 'Необхідна авторизація' });
    }
    const updatedUser = await userService.updateUserProfile(req.user.login, { email });
    res.status(200).json({
      success: true,
      message: 'Профіль успішно оновлено',
      user: updatedUser
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { register, login, verifyEmail, getProfile, updateProfile };