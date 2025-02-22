class VerificationCode {
    constructor(id, generatedCode, inputtedCode, login, verificationStatus = 'non-verified') {
      // Переконуємось, що згенерований код не порожній та обрізаємо зайві пробіли
      if (typeof generatedCode !== 'string' || generatedCode.trim() === '') {
        throw new Error('Generated code не може бути порожнім');
      }
      // Перевірка login: повинен бути непорожнім рядком після обрізання пробілів
      if (typeof login !== 'string' || login.trim() === '') {
        throw new Error('Login не може бути порожнім');
      }

      this.id = id;
      this.generatedCode = generatedCode.trim();
      this.inputtedCode = inputtedCode; // Може бути null, якщо код ще не введено
      this.login = login.trim();
      this.verificationStatus = verificationStatus;
    }
  
    // Створення об'єкта VerificationCode з даних рядка бази даних
    static fromDb(row) {
      if (!row) return null;
      return new VerificationCode(
        row.id,
        row.generated_code,
        row.inputted_code,
        row.login,
        row.verification_status
      );
    }
  
    // Серіалізація об'єкта у JSON-формат (приховуємо внутрішні деталі, якщо потрібно)
    toJSON() {
      return {
        id: this.id,
        generatedCode: this.generatedCode,
        inputtedCode: this.inputtedCode,
        login: this.login,
        verificationStatus: this.verificationStatus,
      };
    }
  }
  
  module.exports = VerificationCode;