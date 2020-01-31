const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, token, amount, nonce, signature) => {
  var url = dvf.config.api + '/v1/trading/w/withdraw'
  const assertionError = await validateAssertions({ dvf, token, amount })
  if (assertionError) return assertionError
  ;({ nonce, signature } = dvf.sign.nonceSignature(nonce, signature))

  const data = {
    token,
    amount,
    nonce,
    signature
  }

  return post(url, { json: data })
}
