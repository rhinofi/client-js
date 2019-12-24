const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')
const parse = require('../lib/parse/response/orders')

module.exports = async (efx, symbol, nonce, signature) => {
  var url = efx.config.api + '/r/openOrders'

  const assertionError = await validateAssertions({efx, symbol})
  if (assertionError) return assertionError

  if (!nonce) {
    nonce = Date.now() / 1000 + 30 + ''
    signature = await efx.sign(nonce.toString(16))
  }

  const data = {
    nonce,
    signature,
    symbol
  }

  return parse(post(url, { json: data }))
}
