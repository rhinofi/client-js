const BN = require('bignumber.js')

module.exports = (token, amount) => {
  const tokenInfo = dvf.token.getTokenInfo(token)

  return new BN(10)
    .pow(tokenInfo.decimals)
    .times(amount)
    .integerValue(BN.ROUND_FLOOR)
    .toString()
}
