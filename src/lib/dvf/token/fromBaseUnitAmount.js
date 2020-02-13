const BN = require('bignumber.js')

module.exports = (dvf, token, baseUnitAmount) => {
  const tokenInfo = dvf.token.getTokenInfo(token)

  return new BN(baseUnitAmount)
    .shiftedBy(-1 * tokenInfo.decimals)
    .decimalPlaces(3)
    .toString()
}
