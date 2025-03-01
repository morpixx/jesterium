const { sendVerificationEmail } = require('../utils/emailService');
const { generateRandomCode } = require('../services/codeGenerator'); // чи інший шлях
const verificationCodeService = require('../services/verificationCodeService');

function generateRandomCode(length = 4) {
    let code = '';
    const chars = '0123456789';
    for (let i = 0; i < length; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }
  