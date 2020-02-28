const post = require('../lib/dvf/post-authenticated')

const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, orderId, nonce, signature) => {
  validateAssertions(dvf, {orderId })

  const endpoint = '/v1/trading/w/cancelOrder'

  const data = {orderId}

  return post(dvf, endpoint, nonce, signature, data)
}
