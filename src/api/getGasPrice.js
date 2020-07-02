const { post } = require('request-promise')

module.exports = async (dvf) => {
  const endpoint = '/v1/trading/r/getGasPrice'
  const url = dvf.config.api + endpoint
  return post(url, { json: {} })
}
