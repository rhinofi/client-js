const { request } = require('@rhino.fi/dvf-utils')

module.exports = async (dvf) => {
  const defaultGasPrice = dvf.config.defaultGasPrice
  const oldGasPrice = { fast: defaultGasPrice * 1.2, average: defaultGasPrice * 0.9, cheap: defaultGasPrice * 0.8 }

  const endpoint = '/v1/trading/r/getGasPrice'
  const url = dvf.config.api + endpoint

  try {
    const newGasPrice = await request.get(url, { json: true })
    dvf.config.defaultGasPrice = newGasPrice.fast || dvf.config.defaultGasPrice
    return newGasPrice ||  oldGasPrice
  }
  catch (e) {
    // TODO: user dvf-logger
    // console.log('failed to get gas price from dvf pub api')
    return oldGasPrice
  }
}
