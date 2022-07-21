const postAuthenticated = require('../../lib/dvf/post-authenticated')

module.exports = async (dvf, nonce, signature, data) => {
  const endpoint = '/v1/trading/userVerification/setEmailOrPhone'
  return postAuthenticated(dvf, endpoint, nonce, signature, data)
}
