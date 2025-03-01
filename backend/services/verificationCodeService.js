const verificationCodeDao = require('../dao/verificationCodeDao');

// Створення нового коду верифікації
async function createVerificationCode(login, generatedCode) {
  // Зазвичай код генерується сервером, але тут передбачається, що його передають
  const newCode = {
    id: null,
    generatedCode,
    inputtedCode: null,
    login,
    verificationStatus: 'non-verified'
  };
  return await verificationCodeDao.createVerificationCode(newCode);
}

// Перевірка коду (порівнюється з останнім записом для login)
async function verifyCode(login, inputtedCode) {
  const storedCode = await verificationCodeDao.getVerificationCodeByLogin(login);
  if (!storedCode) {
    throw new Error('Verification code not found for the given login');
  }
  if (storedCode.generatedCode !== inputtedCode) {
    throw new Error('Invalid verification code');
  }
  await verificationCodeDao.updateVerificationCodeInput(login, inputtedCode);
  return { message: 'Verification successful' };
}

// Отримання коду за ID
async function getVerificationCodeById(id) {
  return await verificationCodeDao.getVerificationCodeById(id);
}

module.exports = { createVerificationCode, verifyCode, getVerificationCodeById };