const BN = require('bignumber.js')

module.exports = (dvf, token, quantizedAmount, rounded = true) => {
  const tokenInfo = dvf.token.getTokenInfo(token)

  let value = new BN(quantizedAmount)
    .times(tokenInfo.quantization)
    .shiftedBy(-1 * tokenInfo.decimals)

  if (rounded) {
    value = value.decimalPlaces(3)
  }

  return value.toString()
}
