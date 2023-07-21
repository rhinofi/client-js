const BN = require('bignumber.js')

module.exports = (dvf, token, amount, customTokenInfo) => {
  const tokenInfo = customTokenInfo || dvf.token.getTokenInfo(token)

  return new BN(10)
    .pow(tokenInfo.decimals)
    .times(amount)
    .integerValue(BN.ROUND_FLOOR)
    .toString()
}
