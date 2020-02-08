const getTokenRegistry = require('./getTokenRegistry')
const BN = require('bignumber.js')

module.exports = (token, amount) => {
  const tokenInfo = getTokenRegistry(token)

  return new BN(10)
    .pow(tokenInfo.decimals)
    .times(amount)
    .integerValue(BN.ROUND_FLOOR)
    .toString()
}
