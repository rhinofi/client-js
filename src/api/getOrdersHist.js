const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, symbol, nonce, signature) => {
  var url = dvf.config.api + '/v1/trading/r/orderHistory'

  const assertionError = await validateAssertions({ dvf, symbol })
  if (assertionError) return assertionError
  ;({ nonce, signature } = dvf.sign.nonceSignature(nonce, signature))

  const data = {
    symbol,
    nonce,
    signature
  }

  return post(url, { json: data })
}
