const { request } = require('@rhino.fi/dvf-utils')

module.exports = async dvf => {
  const url = dvf.config.api + '/v1/trading/r/getConf'
  try {
    const exchangeConf = await request.post(url, { json: {} })
    dvf.config = Object.assign({}, dvf.config, exchangeConf)
    return exchangeConf
  } catch (error) {
    // TODO: use logger
    // console.log('error getting config from dvf-pub-api')
    return dvf.config
  }
}
