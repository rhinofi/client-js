const { post } = require('request-promise')
const parse = require('../lib/parse/response/orders')

module.exports = async efx => {
  const url = efx.config.api + '/getUserConf'
  const nonce = Date.now() / 1000 + 30 + ''
  const signature = await efx.sign(nonce.toString(16))

  const data = {
    nonce,
    signature
  }

  const exchangeConf = await parse(post(url, { json: data }))
  return exchangeConf
}
