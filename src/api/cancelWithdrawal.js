const post = require('../lib/dvf/post-authenticated')

const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, id, nonce, signature) => {
  validateAssertions(dvf, { id })

  const endpoint = '/v1/trading/w/cancelWithdrawal'

  const data = {id}

  return post(dvf, endpoint, nonce, signature, data)
}
