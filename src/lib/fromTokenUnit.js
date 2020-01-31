const BN = require('bignumber.js')

module.exports = (dvf, token, amount) => {
  return BN(amount).shiftedBy(-1 * dvf.token.getTokenInfo(token).decimals)
}
