const { post } = require('request-promise')

// TODO: define a schema for data and validate it.
module.exports = async (dvf, data) => {
  const payload = await dvf.createOrderPayload(data)

  const url = dvf.config.api + '/v1/trading/w/submitOrder'

  const submitResponse = await post(url, { json: payload })

  await dvf.getUserConfig()

  return submitResponse
}
