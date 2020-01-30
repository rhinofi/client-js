const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')
const parse = require('../lib/parse/response/orders')

module.exports = async (dvf, symbol, nonce, signature) => {
  var url = dvf.config.api + '/v1/trading/r/openOrders'

  const assertionError = await validateAssertions({ dvf, symbol })
  if (assertionError) return assertionError
  ;({ nonce, signature } = dvf.sign.nonceSignature(nonce, signature))

  const data = {
    nonce,
    signature,
    symbol
  }

  return parse(post(url, { json: data }))
}
