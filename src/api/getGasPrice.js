const get = require('../lib/dvf/get-generic')

module.exports = async (dvf) => {
  const defaultGasPrice = dvf.config.defaultGasPrice
  const oldGasPrice = { fast: defaultGasPrice * 1.2, average: defaultGasPrice * 0.9, cheap: defaultGasPrice * 0.8 }

  const url = '/v1/trading/r/getGasPrice'

  try {
    const newGasPrice = await get(dvf, url)
    dvf.config.defaultGasPrice = newGasPrice.fast || dvf.config.defaultGasPrice
    return newGasPrice ||  oldGasPrice
  }
  catch (e) {
    // TODO: user dvf-logger
    // console.log('failed to get gas price from dvf pub api')
    return oldGasPrice
  }
}
