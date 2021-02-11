const { post } = require('request-promise')

module.exports = async (dvf, data, starkPrivateKey) => {
  const url = dvf.config.api + '/v1/trading/w/transfer'
  const json = await dvf.createTransferPayload(data, starkPrivateKey)
  return post(url, { json })
}
