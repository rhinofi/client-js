const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, nonce, signature, token) => {
  var url = dvf.config.api + '/v1/trading/r/getWithdrawals'

  if (token) {
    const assertionError = await validateAssertions({ dvf, token })
    if (assertionError) return assertionError
  }

  ;({ nonce, signature } = dvf.sign.nonceSignature(nonce, signature))

  const data = {
    nonce,
    signature,
    ...(token && { token })
  }

  return post(url, { json: data })
}
