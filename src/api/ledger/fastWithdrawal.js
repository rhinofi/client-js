const { post } = require('request-promise')

module.exports = async (dvf, withdrawalData, path) => {
  const url = dvf.config.api + '/v1/trading/w/fastWithdrawal'
  const json = await dvf.stark.ledger.createFastWithdrawalPayload(withdrawalData, path)
  return post(url, { json })
}
