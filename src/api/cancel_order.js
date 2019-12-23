const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (efx, orderId) => {
  const assertionError = validateAssertions({efx, orderId})
  if (assertionError) return assertionError

  const url = efx.config.api + '/w/cancelOrder'
  let data = {
    orderId: orderId
  }

  return post(url, { json: data })
}
