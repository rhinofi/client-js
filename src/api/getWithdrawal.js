const post = require('../lib/dvf/post-authenticated')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, withdrawalId, nonce, signature) => {
  const assertionError = await validateAssertions({ dvf, withdrawalId})
  if (assertionError) return assertionError

  const endpoint = '/v1/trading/r/getWithdrawal'

  const data = {withdrawalId}

  return post(dvf, endpoint, nonce, signature, data)
}
