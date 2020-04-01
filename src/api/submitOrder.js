const { post } = require('request-promise')

// TODO: define a schema for data and validate it.
module.exports = async (dvf, orderData) =>
  post(dvf.config.api + '/v1/trading/w/submitOrder', {
    json: await dvf.createOrderPayload(orderData)
  })
