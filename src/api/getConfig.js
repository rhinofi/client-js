const { post } = require('request-promise')

module.exports = async dvf => {
  const url = dvf.config.api + '/v1/trading/r/getConf'
  try {
    const exchangeConf = await post(url, { json: {} })
    dvf.config = Object.assign({}, dvf.config, exchangeConf)
    return exchangeConf
  } catch (error) {
    console.log('error getting config from dvf-pub-api')
    return dvf.config
  }
}
