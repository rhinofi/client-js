const getAuthenticated = require('../../lib/dvf/get-authenticated')

module.exports = async (dvf, nonce, signature) => {
  const endpoint = `/v1/trading/userVerification/isUserVerified`
  return getAuthenticated(dvf, endpoint, nonce, signature)
}
