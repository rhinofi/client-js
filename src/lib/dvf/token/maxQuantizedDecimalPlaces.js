const BN = require('bignumber.js')

module.exports = (dvf, token) => {
  console.log(dvf)
  const tokenInfo = dvf.token.getTokenInfo(token)
  const quantizedUnit = new BN(10).pow(tokenInfo.decimals).div(tokenInfo.quantization).toString()
  return (quantizedUnit.length-1)
}
