const getTokenRegistry = require('./getTokenRegistry')
const BN = require('bignumber.js')

module.exports = (token, baseUnitAmount) => {
  const tokenInfo = getTokenRegistry(token)

  return new BN(baseUnitAmount)
    .shiftedBy(-1 * tokenInfo.decimals)
    .integerValue(BN.ROUND_FLOOR)
    .toString()
}
