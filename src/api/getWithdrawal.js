const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, withdrawalId, nonce, signature) => {
  var url = dvf.config.api + '/v1/trading/r/getWithdrawal'

  const assertionError = await validateAssertions({ dvf, withdrawalId })
  if (assertionError) return assertionError
  ;({ nonce, signature } = dvf.sign.nonceSignature(nonce, signature))

  const data = {
    withdrawalId,
    nonce,
    signature
  }

  return post(url, { json: data })
}
