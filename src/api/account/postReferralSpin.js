const postAuthenticated = require('../../lib/dvf/post-authenticated')

module.exports = async (dvf, user, nonce, signature) => {
  const endpoint = '/v1/trading/w/referralSpin'
  const response = await postAuthenticated(dvf, endpoint, nonce, signature, { user })
  return response
}
