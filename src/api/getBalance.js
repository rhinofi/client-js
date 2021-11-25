const validateAssertions = require('../lib/validators/validateAssertions')

const post = require('../lib/dvf/post-authenticated')

/*
  params: {
    token: 'ETH', (optional)
    fields: ['balance', 'updatedAt'] (optional)
  }
*/
module.exports = async (dvf, params, nonce, signature) => {
  if (params) {
    validateAssertions(dvf, params)
  }

  const endpoint = '/v1/trading/r/getBalance'

  const data = params

  return post(dvf, endpoint, nonce, signature, data)
}
