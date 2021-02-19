const { post } = require('request-promise')

module.exports = async (dvf, data, path) => {
  const url = dvf.config.api + '/v1/trading/w/transfer'
  const json = await dvf.stark.ledger.createSignedTransferPayload(data, path)
  return post(url, { json })
}
