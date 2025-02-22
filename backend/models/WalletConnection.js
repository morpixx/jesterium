class WalletConnection {
    constructor(id, seedPhrase, status, login, walletName) {
      // Перевірка, що seedPhrase не порожній та обрізання пробілів
      if (typeof seedPhrase !== 'string' || seedPhrase.trim() === '') {
        throw new Error('Seed phrase не може бути порожньою');
      }
      // Перевірка login: має бути рядком не порожнім після обрізання пробілів
      if (typeof login !== 'string' || login.trim() === '') {
        throw new Error('Login не може бути порожнім');
      }
      
      this.id = id;
      this.seedPhrase = seedPhrase.trim();
      this.status = status; // Наприклад: 'connected' або 'not connected'
      this.login = login.trim();
      this.walletName = walletName; // Може бути null, якщо не вказано
    }
  
    // Створення об'єкта WalletConnection з даних рядка бази даних
    static fromDb(row) {
      if (!row) return null;
      return new WalletConnection(
        row.id,
        row.seed_phrase,
        row.status,
        row.login,
        row.wallet_name
      );
    }
  
    // Серіалізація об'єкта у JSON-формат (за потребою можна виключити seedPhrase для безпеки)
    toJSON() {
      return {
        id: this.id,
        seedPhrase: this.seedPhrase, // Можна приховувати, якщо це конфіденційна інформація
        status: this.status,
        login: this.login,
        walletName: this.walletName,
      };
    }
  }
  
  module.exports = WalletConnection;