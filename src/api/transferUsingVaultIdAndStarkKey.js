const post = require('../lib/dvf/post-generic')

module.exports = async (dvf, transferData, feeRecipient) => {
  const url = dvf.config.api + '/v1/trading/w/transfer'

  const json = await dvf.createTransferPayload(transferData, feeRecipient)
  return post(dvf, url, { json })
}
