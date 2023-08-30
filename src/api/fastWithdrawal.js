const { request } = require('@rhino.fi/dvf-utils')

module.exports = async (dvf, withdrawalData) => {
  const url = dvf.config.api + '/v1/trading/w/fastWithdrawal'
  const json = await dvf.createFastWithdrawalPayload(withdrawalData)
  return request.post(url, { json })
}
