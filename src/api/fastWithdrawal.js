const { post } = require('request-promise')

module.exports = async (dvf, withdrawalData) => {
  const url = dvf.config.api + '/v1/trading/w/fastWithdrawal'
  const json = await dvf.createFastWithdrawalPayload(withdrawalData)
  return post(url, { json, headers: { Authorization: dvf.config.apiKey} })
}
