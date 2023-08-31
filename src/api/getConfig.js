const post = require('../lib/dvf/post-generic')

module.exports = async dvf => {
  const url = '/v1/trading/r/getConf'
  try {
    const exchangeConf = await post(dvf, url)
    dvf.config = Object.assign({}, dvf.config, exchangeConf)
    return exchangeConf
  } catch (error) {
    // TODO: use logger
    // console.log('error getting config from dvf-pub-api')
    return dvf.config
  }
}
