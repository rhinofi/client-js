const validateAssertions = require('../lib/validators/validateAssertions')

const post = require('../lib/dvf/post-authenticated')

module.exports = async (dvf, token, nonce, signature) => {
  if (token) {
    validateAssertions(dvf, {token})
  }

  const endpoint = '/v1/trading/r/getBalance'

  const data = {token}

  return post(dvf, endpoint, nonce, signature, data)
}

