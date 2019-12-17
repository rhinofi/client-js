const { post } = require('request-promise')

module.exports = async efx => {
  const url = efx.config.api + '/r/getConf'
  const exchangeConf = await post(url, { json: {} })
  efx.config = Object.assign({}, efx.config, exchangeConf)
  return exchangeConf
}
