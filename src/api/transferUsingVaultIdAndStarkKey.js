const { post } = require('request-promise')

module.exports = async (dvf, transferData, feeRecipient) => {
  const url = dvf.config.api + '/v1/trading/w/transfer'

  const json = await dvf.createTransferPayload(transferData, feeRecipient)
  return post(url, { json,headers: { Authorization: dvf.config.apiKey} })
}
