const get = require('../lib/dvf/get-authenticated')

const endpoint = '/v1/trading/r/fastWithdrawalMaxAmount'

module.exports = async (dvf, token, nonce, signature) => {
  return get(dvf, endpoint, nonce, signature, { token })
}
