const nodemailer = require('nodemailer');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error('Вкажіть EMAIL_USER та EMAIL_PASS у змінних середовища');
}

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  secure: true, // використання SSL/TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendVerificationEmail(email, code) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Підтвердження реєстрації',
    text: `Ваш код підтвердження: ${code}`,
    html: `<p>Ваш код підтвердження: <strong>${code}</strong></p>`
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail };
