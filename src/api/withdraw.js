const post = require('../lib/dvf/post-authenticated')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, token, amount, nonce, signature) => {
  const assertionError = await validateAssertions({ dvf, token, amount })

  if (assertionError) return assertionError

  const endpoint = '/v1/trading/w/withdraw'

  const data = {token, amount}

  return post(dvf, endpoint, nonce, signature, data)
}
