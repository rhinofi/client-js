const { prepareAmount, BN } = require('@rhino.fi/dvf-utils')

module.exports = (dvf, amount, token) => prepareAmount(
  amount,
  dvf.token.maxQuantizedDecimalPlaces(token),
  BN.ROUND_FLOOR
)
