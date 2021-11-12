const { post } = require('request-promise')

module.exports = async (dvf, transferData) => {
  const url = dvf.config.api + '/v2/trading/w/transferAndWithdraw'

  const json = await dvf.createTransferAndWithdrawPayload(transferData)

  return post(url, { json })
}
