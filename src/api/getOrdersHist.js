const post = require('../lib/dvf/post-authenticated')

const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, symbol, nonce, signature) => {
  const assertionError = await validateAssertions({ dvf, symbol })
  if (assertionError) return assertionError

  const endpoint = '/v1/trading/r/orderHistory'

  const data = {symbol}

  return post(dvf, endpoint, nonce, signature, data)
}
