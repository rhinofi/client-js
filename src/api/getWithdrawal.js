const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, withdrawalId, nonce, signature) => {
  var url = dvf.config.api + '/v1/trading/r/getWithdrawal'

  const assertionError = await validateAssertions({ dvf, withdrawalId })
  if (assertionError) return assertionError

  if (!(nonce && signature)) {
    nonce = Date.now() / 1000 + ''
    signature = await dvf.sign(nonce.toString(16))
  }

  const data = {
    withdrawalId,
    nonce,
    signature
  }

  return post(url, { json: data })
}
