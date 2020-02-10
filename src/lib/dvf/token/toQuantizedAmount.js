const BN = require('bignumber.js')

module.exports = (dvf, token, amount) => {
  const tokenInfo = dvf.token.getTokenInfo(token)

  return new BN(10)
    .pow(tokenInfo.decimals)
    .times(amount)
    .dividedBy(tokenInfo.quantization)
    .integerValue(BN.ROUND_FLOOR)
    .toString()
}
