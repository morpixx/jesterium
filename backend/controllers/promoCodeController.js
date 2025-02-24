const { redeemPromoCode } = require('../services/promoCodeService');

async function redeemPromoCodeController(req, res) {
  try {
    const { promoCode } = req.body;
    const result = redeemPromoCode(promoCode);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { redeemPromoCodeController };