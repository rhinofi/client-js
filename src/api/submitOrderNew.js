const rp = require('request-promise')

// TODO: define a schema for data and validate it.
module.exports = async (dvf, data) => rp.post(
  dvf.config.api + '/v1/trading/w/submitOrder',
  { json: await dvf.createOrderPayload(data) }
}
