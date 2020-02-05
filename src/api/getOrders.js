const post = require('../lib/dvf/post-authenticated')

const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, symbol, nonce, signature) => {
  const endpoint = '/v1/trading/r/openOrders'

  const assertionError = await validateAssertions({ dvf, symbol })
  if (assertionError) return assertionError

  const data = {symbol}

  return post(dvf, endpoint, nonce, signature, data)
}
