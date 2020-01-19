const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, orderId) => {
  const assertionError = await validateAssertions({dvf, orderId})
  if (assertionError) return assertionError

  const url = dvf.config.api + '/v1/trading/w/cancelOrder'
  let data = {
    orderId: orderId
  }

  return post(url, { json: data })
}
