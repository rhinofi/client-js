const get = require('../lib/dvf/get-generic')

// TODO: Deprecated (CHAIN-719)
module.exports = async (dvf, token) => {
  const url = '/v1/trading/r/fastWithdrawalFee'
  return get(dvf, url, { json: true, qs: { token } })
}
