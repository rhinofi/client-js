const { post } = require('request-promise')
const parse = require('../lib/parse/response/orders')

module.exports = async dvf => {
  const url = dvf.config.api + '/r/getUserConf'
  const nonce = Date.now()
  const signature = await dvf.sign(nonce.toString(16))

  const data = {
    nonce,
    signature
  }
  const exchangeUserConf = await parse(post(url, { json: data }))
  dvf.config = Object.assign(dvf.config, exchangeUserConf)
  return exchangeUserConf
}
