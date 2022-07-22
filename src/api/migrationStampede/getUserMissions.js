const getAuthenticated = require('../../lib/dvf/get-authenticated')

module.exports = async (dvf, nonce, signature) => {
  const endpoint = '/v1/trading/r/userStampedeMissions'
  return getAuthenticated(dvf, endpoint, nonce, signature)
}
