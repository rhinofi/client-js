const post = require('../lib/dvf/post-authenticated')

const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, symbol, nonce, signature) => {
  if (symbol) {
    validateAssertions(dvf, { symbol })
  }

  const endpoint = '/v1/trading/r/orderHistory'

  const data = { symbol }

  return post(dvf, endpoint, nonce, signature, data)
}
