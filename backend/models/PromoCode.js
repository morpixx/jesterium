/**
 * @swagger
 * components:
 *   schemas:
 *     PromoCode:
 *       type: object
 *       required:
 *         - code
 *         - discount
 *       properties:
 *         id:
 *           type: integer
 *           description: Унікальний ідентифікатор промокоду
 *         code:
 *           type: string
 *           description: Унікальний код промокоду
 *         discount:
 *           type: integer
 *           description: Знижка у відсотках
 *         maxUses:
 *           type: integer
 *           description: Максимальна кількість використань
 *           default: 1
 *         currentUses:
 *           type: integer
 *           description: Поточна кількість використань
 *           default: 0
 *         expiryDate:
 *           type: string
 *           format: date
 *           description: Дата закінчення дії
 *         isActive:
 *           type: boolean
 *           description: Чи активний промокод
 *           default: true
 *         description:
 *           type: string
 *           description: Опис промокоду
 *         coinReward:
 *           type: integer
 *           description: Кількість монет, які нараховуються при використанні
 *           default: 0
 *       example:
 *         id: 1
 *         code: Jesterium
 *         discount: 0
 *         maxUses: 1000
 *         currentUses: 5
 *         expiryDate: null
 *         isActive: true
 *         description: Отримайте 1000 Jesterium монет
 *         coinReward: 1000
 */
class PromoCode {
  constructor(id, code, discount, maxUses, currentUses, expiryDate, isActive, description, coinReward) {
    this.id = id;
    this.code = code;
    this.discount = discount;
    this.maxUses = maxUses || 1;
    this.currentUses = currentUses || 0;
    this.expiryDate = expiryDate;
    this.isActive = isActive !== undefined ? isActive : true;
    this.description = description || '';
    this.coinReward = coinReward || 0;
  }

  static fromDb(row) {
    if (!row) return null;
    return new PromoCode(
      row.id,
      row.code,
      row.discount,
      row.max_uses,
      row.current_uses,
      row.expiry_date,
      row.is_active === 1,
      row.description,
      row.coin_reward
    );
  }

  isValid() {
    // Перевірка активності
    if (!this.isActive) return false;
    
    // Перевірка кількості використань
    if (this.currentUses >= this.maxUses) return false;
    
    // Перевірка терміну дії
    if (this.expiryDate && new Date(this.expiryDate) < new Date()) return false;
    
    return true;
  }

  // Метод для отримання об'єкта без чутливих даних
  toJSON() {
    return {
      id: this.id,
      code: this.code,
      discount: this.discount,
      maxUses: this.maxUses,
      currentUses: this.currentUses,
      expiryDate: this.expiryDate,
      isActive: this.isActive,
      description: this.description,
      coinReward: this.coinReward,
      isValid: this.isValid()
    };
  }
}

module.exports = PromoCode; 