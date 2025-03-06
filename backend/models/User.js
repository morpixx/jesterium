class User {
  constructor(id, login, email, password, status, wallet_status, balance, created_at) {
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
    this.email = email;
    this.password = password;
    this.status = status;
    this.wallet_status = wallet_status;
    this.balance = balance;
    this.created_at = created_at;
  }

  // Створення об'єкта User з даних рядка бази даних
  static fromDb(row) {
    if (!row) return null;
    return new User(
      row.id,
      row.login,
      row.email, // перевірте, що назва стовпця збігається (email)
      row.password,
      row.status,
      row.wallet_status,
      row.balance,
      row.created_at
    );
  }

  // Повертає об'єкт без поля password для безпечної серіалізації
  toJSON() {
    return {
      id: this.id,
      login: this.login,
      email: this.email,
      status: this.status,
      wallet_status: this.wallet_status,
      balance: this.balance,
      created_at: this.created_at
    };
  }
}

module.exports = User;