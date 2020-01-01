const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (efx, orderId, nonce, signature) => {
  var url = efx.config.api + '/r/getOrder'

  const assertionError = await validateAssertions({efx, orderId})
  if (assertionError) return assertionError

  if (!nonce) {
    nonce = Date.now() / 1000 + 30 + ''
    signature = await efx.sign(nonce.toString(16))
  }

  const data = {
    orderId,
    nonce,
    signature
  }

  return post(url, { json: data })
}
