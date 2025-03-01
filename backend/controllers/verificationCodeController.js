const verificationCodeService = require('../services/verificationCodeService');

// Створення нового коду верифікації
async function createVerificationCode(req, res) {
  try {
    const { login, generatedCode } = req.body;
    const newCode = await verificationCodeService.createVerificationCode(login, generatedCode);
    res.status(201).json(newCode);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Перевірка введеного коду
async function verifyCode(req, res) {
  try {
    const { login, inputtedCode } = req.body;
    const result = await verificationCodeService.verifyCode(login, inputtedCode);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Отримання даних коду верифікації за ID
async function getVerificationCodeById(req, res) {
  try {
    const id = req.params.id;
    const code = await verificationCodeService.getVerificationCodeById(id);
    if (!code) {
      return res.status(404).json({ error: "Verification code not found" });
    }
    res.status(200).json(code);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { createVerificationCode, verifyCode, getVerificationCodeById };
