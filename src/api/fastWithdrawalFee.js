const { get } = require('request-promise')

// TODO: Deprecated (CHAIN-719)
module.exports = async (dvf, token) => {
  const url = dvf.config.api + '/v1/trading/r/fastWithdrawalFee'
  return get(url, { json: true, qs: { token } })
}
