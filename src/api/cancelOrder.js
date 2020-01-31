const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, orderId, nonce, signature) => {
  
  const assertionError = await validateAssertions({ dvf, orderId })
  if (assertionError) return assertionError

  ;({ nonce, signature } = dvf.sign.nonceSignature(nonce, signature))

  const url = dvf.config.api + '/v1/trading/w/cancelOrder'

  let data = {
    orderId: orderId
  }

  return post(url, { json: data })
}
