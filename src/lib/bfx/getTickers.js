const { get } = require('request-promise')
const dvfToBfxSymbol = require('../dvf/dvfToBfxSymbol')

module.exports = async (dvf, symbols) => {
  if (symbols.constructor !== Array) {
    symbols = [symbols]
  }

  symbols = symbols.map(dvfToBfxSymbol).join(',')

  const response = await get(dvf.config.api + `/bfx/v2/tickers?symbols=${symbols}`)
  return JSON.parse(response)
}
