const allowedPromoCodes = ['Jesterium', 'AirDrop', 'Gift'];

function redeemPromoCode(promoCode) {
  if (!promoCode || typeof promoCode !== 'string') {
    throw new Error('Промокод має бути рядком');
  }

  if (allowedPromoCodes.includes(promoCode.trim())) {
    // Повертаємо 1000 коінів під назвою 'Jesterium'
    return { coinName: 'Jesterium', amount: 1000 };
  } else {
    throw new Error('Невірний промокод');
  }
}

module.exports = { redeemPromoCode };