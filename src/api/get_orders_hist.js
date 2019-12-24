const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (efx, symbol, nonce, signature) => {
  var url = efx.config.api + '/r/orderHistory'

  const assertionError = await validateAssertions({efx, symbol})
  if (assertionError) return assertionError

  if (!nonce) {
    nonce = Date.now() / 1000 + 30 + ''
    signature = await efx.sign(nonce.toString(16))
  }

  const data = {
    symbol,
    nonce,
    signature
  }

  return post(url, { json: data })
}
