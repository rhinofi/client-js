const BN = require('bignumber.js')

module.exports = (dvf, token, quantizedAmount) => {
  const tokenInfo = dvf.token.getTokenInfo(token)

  return new BN(quantizedAmount)
    .times(tokenInfo.quantization)
    .shiftedBy(-1 * tokenInfo.decimals)
    .integerValue(BN.ROUND_FLOOR)
    .toString()
}
