const { toQuantizedAmountString } = require('dvf-utils')

module.exports = (dvf, token, amount) => {
  const tokenInfo = dvf.token.getTokenInfo(token)

  return toQuantizedAmountString(tokenInfo, amount)
}
