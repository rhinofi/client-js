const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = (efx, orderId, nonce, signature) => {
  const assertionError = validateAssertions({efx, orderId})
  if (assertionError) return assertionError

  return efx.getOrders(null, orderId, nonce, signature)
}
