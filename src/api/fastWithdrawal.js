const { post } = require('request-promise')

module.exports = async (dvf, withdrawalData, starkPrivateKey) => {
  json = await dvf.createFastWithdrawalPayload(withdrawalData, starkPrivateKey)
  return post(url, { json })
}
