const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, orderId, nonce, signature) => {
  var url = dvf.config.api + '/v1/trading/r/getOrder'

  const assertionError = await validateAssertions({ dvf, orderId })
  if (assertionError) return assertionError
  ;({ nonce, signature } = dvf.sign.nonceSignature(nonce, signature))

  const data = {
    orderId,
    nonce,
    signature
  }

  return post(url, { json: data })
}
