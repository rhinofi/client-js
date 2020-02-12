const post = require('../lib/dvf/post-authenticated')

const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, symbol, nonce, signature) => {
  const endpoint = '/v1/trading/r/openOrders'

  if (symbol) {
    validateAssertions(dvf, {symbol})
  }

  const data = {symbol}

  return post(dvf, endpoint, nonce, signature, data)
}
