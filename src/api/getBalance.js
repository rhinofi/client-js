const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, nonce, signature, token) => {
  validateAssertions(dvf, {nonce, signature })

  const data = {
    nonce,
    signature
  }
  
  if (token) {
    data.token = token
  }

  // console.log('data is ', data)
  const url = dvf.config.api + '/v1/trading/r/getBalance'
  return post(url, { json: data })
}
