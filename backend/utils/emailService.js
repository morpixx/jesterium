const nodemailer = require('nodemailer');
const config = require('../config/config');

// Транспорт для відправки email
const transporter = nodemailer.createTransport({
  service: config.email.service,
  auth: {
    user: config.email.user,
    pass: config.email.password
  }
});

// Відправка коду підтвердження
async function sendVerificationCode(email, code) {
  const mailOptions = {
    from: config.email.user,
    to: email,
    subject: 'Jesterium - Confirm Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://yoursite.com/logo.png" alt="Jesterium Logo" style="width: 150px;">
        </div>
        <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h2 style="color: #4a4a4a; text-align: center;">Confirm Email</h2>
          <p style="color: #666; line-height: 1.5;">Дякуємо за реєстрацію в Jesterium! Для завершення реєстрації введіть цей код на сайті:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; background: #f0f0f0; padding: 15px; border-radius: 5px; display: inline-block;">${code}</div>
          </div>
          <p style="color: #666; line-height: 1.5;">If you did not register in Jesterium, simply ignore this email.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Jesterium. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Помилка відправки email:', error);
    throw new Error('Не вдалося відправити код підтвердження');
  }
}

module.exports = {
  sendVerificationCode
};
