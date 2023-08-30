const { request } = require('@rhino.fi/dvf-utils')

// TODO: Deprecated (CHAIN-719)
module.exports = async (dvf, token) => {
  const url = dvf.config.api + '/v1/trading/r/fastWithdrawalFee'
  return request.get(url, { json: true, qs: { token } })
}
