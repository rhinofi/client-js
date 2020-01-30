const { post } = require('request-promise')
const parse = require('../lib/parse/response/orders')

module.exports = async (dvf, nonce, signature) => {
  const url = dvf.config.api + '/v1/trading/r/getUserConf'
  ;({ nonce, signature } = dvf.sign.nonceSignature(nonce, signature))
  const data = {
    nonce,
    signature
  }
  const exchangeUserConf = await parse(post(url, { json: data }))
  dvf.config = Object.assign(dvf.config, exchangeUserConf)
  return exchangeUserConf
}
