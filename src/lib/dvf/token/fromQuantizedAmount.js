const getTokenRegistry = require('./getTokenRegistry')
const BN = require('bignumber.js')

module.exports = (token, quantizedAmount) => {
  const tokenInfo = getTokenRegistry(token)

  return new BN(quantizedAmount)
    .times(tokenInfo.quantization)
    .shiftedBy(-1 * tokenInfo.decimals)
    .integerValue(BN.ROUND_FLOOR)
    .toString()
}
