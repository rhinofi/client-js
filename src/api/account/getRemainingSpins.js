const getAuthenticated = require('../../lib/dvf/get-authenticated')

module.exports = async (dvf, nonce, signature) => {
  const endpoint = '/v1/trading/r/referralRemainingSpins'
  const response = await getAuthenticated(dvf, endpoint, nonce, signature)
  return response
}
