const post = require('../lib/dvf/post-authenticated')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, token, nonce, signature) => {
  if (token) {
    validateAssertions(dvf, { token })
  }

  const endpoint = '/v1/trading/r/getWithdrawals'

  const data = { token }

  return post(dvf, endpoint, nonce, signature, data)
}
