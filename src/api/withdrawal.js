const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, token, amount, nonce, signature) => {
  var url = dvf.config.api + '/v1/trading/w/withdrawal'
  const assertionError = await validateAssertions({ dvf, token, amount })
  if (assertionError) return assertionError
  
  if (!(nonce && signature)) {
    nonce = Date.now() / 1000 + ''
    signature = await dvf.sign(nonce.toString(16))
  }

  const data = {
    token,
    amount,
    nonce,
    signature
  }
  
  return post(url, { json: data })
}
