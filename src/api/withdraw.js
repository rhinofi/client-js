const post = require('../lib/dvf/post-authenticated')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, token, amount, nonce, signature) => {
  validateAssertions(dvf, {token, amount })

  const endpoint = '/v1/trading/w/withdraw'

  const data = {token, amount}

  return post(dvf, endpoint, nonce, signature, data)
}
