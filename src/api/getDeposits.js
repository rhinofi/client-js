const post = require('../lib/dvf/post-authenticated')

const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, token, nonce, signature) => {
  const endpoint = '/v1/trading/r/getDeposits'

  if (token) {
    const assertionError = await validateAssertions({ dvf, token })
    if (assertionError) return assertionError
  }

  const data = {token}

  return post(dvf, endpoint, nonce, signature, data)
}
