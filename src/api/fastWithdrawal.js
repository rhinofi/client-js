const { post } = require('request-promise')

module.exports = async (dvf, withdrawalData, starkPrivateKey) => {
  const url = dvf.config.api + '/v1/trading/w/fastWithdrawal'
  const json = await dvf.createFastWithdrawalPayload(withdrawalData, starkPrivateKey)
  return post(url, { json })
}
