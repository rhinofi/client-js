const { post } = require('request-promise')

module.exports = async (efx, orderId) => {
  const url = efx.config.api + '/w/cancelOrder'
  let data = {
    orderId: parseInt(orderId)
  }

  return post(url, { json: data })
}
