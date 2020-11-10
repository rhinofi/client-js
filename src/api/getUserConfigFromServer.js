const post = require('../lib/dvf/post-authenticated')

module.exports = async (dvf, nonce, signature) => {
  const endpoint = '/v1/trading/r/getUserConf'

  return post(dvf, endpoint, nonce, signature)
}
