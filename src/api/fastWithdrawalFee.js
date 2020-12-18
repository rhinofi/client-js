const { get } = require('request-promise')

module.exports = async (dvf, token) => {
  const url = dvf.config.api + '/v1/trading/r/fastWithdrawalFee'
  return get(url, { qs: { token } })
}
