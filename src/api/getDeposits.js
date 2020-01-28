const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, nonce, signature, token) => {
  var url = dvf.config.api + '/v1/trading/r/getDeposits'

  if (token) {
    const assertionError = await validateAssertions({ dvf, token })
    if (assertionError) return assertionError
  }
  if (!nonce) {
    nonce = Date.now() / 1000 + ''
    signature = await dvf.sign(nonce.toString(16))
  }

  const data = {
    nonce,
    signature,
    ...(token && { token })
  }

  return post(url, { json: data })
}
