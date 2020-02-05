const post = require('../lib/dvf/post-authenticated')

module.exports = async (dvf, nonce, signature) => {
  const endpoint = '/v1/trading/r/getUserConf'

  const exchangeUserConf = await post(dvf, endpoint, nonce, signature)
  
  dvf.config = Object.assign(dvf.config, exchangeUserConf)
  
  return exchangeUserConf
}
