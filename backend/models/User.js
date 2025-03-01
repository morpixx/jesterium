class User {
  constructor(id, login, password, status = 'non-verified') {
    // Обрізка пробілів у логіні та перевірка
    if (typeof login !== 'string' || login.trim().length < 3) {
      throw new Error('Login повинен бути рядком з мінімум 3 символів');
    }
    // Перевірка пароля
    if (typeof password !== 'string' || password.length < 6) {
      throw new Error('Password повинен бути рядком з мінімум 6 символів');
    }
    this.id = id;
    this.login = login.trim();
    this.password = password;
    this.status = status;
  }

  // Створення об'єкта User з даних рядка бази даних
  static fromDb(row) {
    if (!row) return null;
    return new User(row.id, row.login, row.password, row.status);
  }

  // Повертає об'єкт без поля password для безпечної серіалізації
  toJSON() {
    const { id, login, status } = this;
    return { id, login, status };
  }
}

module.exports = User;