const { request } = require('@rhino.fi/dvf-utils')

module.exports = async (dvf, transferData, feeRecipient) => {
  const url = dvf.config.api + '/v1/trading/w/transfer'

  const json = await dvf.createTransferPayload(transferData, feeRecipient)
  return request.post(url, { json })
}
