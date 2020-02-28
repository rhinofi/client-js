const post = require('../lib/dvf/post-authenticated')

module.exports = async (dvf, nonce, signature) => {
  const endpoint = '/v1/trading/r/getUserConf'

  const exchangeUserConf = await post(dvf, endpoint, nonce, signature)

  // TODO: here we have to check what was the response, if we need to 
  // register then simply ignore and return, otherwise merge the config.
  // REVIEW: test e2e, is this if actually working?
  if(!exchangeUserConf.error){
    dvf.config = Object.assign(dvf.config, exchangeUserConf)
  }

  return exchangeUserConf
}
