const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')
const parse = require('../lib/parse/response/orders')

module.exports = async (dvf, symbol, nonce, signature) => {
  var url = dvf.config.api + '/r/openOrders'

  const assertionError = await validateAssertions({ dvf, symbol })
  if (assertionError) return assertionError

  if (!nonce) {
    nonce = Date.now() / 1000 + 30 + ''
    signature = await dvf.sign(nonce.toString(16))
  }

  const data = {
    nonce,
    signature,
    symbol
  }

  return parse(post(url, { json: data }))
}
