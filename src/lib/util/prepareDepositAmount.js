const { prepareAmount, BN } = require('dvf-utils')

module.exports = (dvf, amount, token) => prepareAmount(
  amount,
  console.log('dvf.token.maxQuantizedDecimalPlaces(token)', dvf.token.maxQuantizedDecimalPlaces(token)) || dvf.token.maxQuantizedDecimalPlaces(token),
  BN.ROUND_FLOOR
)
