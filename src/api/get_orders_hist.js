const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = (efx, symbol, nonce, signature) => {
  const assertionError = validateAssertions({efx, symbol, nonce, signature})
  if (assertionError) return assertionError
  let orderId = 'hist'
  return efx.getOrders(symbol, orderId, nonce, signature)
}
