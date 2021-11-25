const { get } = require('request-promise')

module.exports = async (dvf, symbols) => {
  if (symbols.constructor !== Array) {
    symbols = [symbols]
  }

  const response = await get(`${dvf.config.api}/market-data/tickers?symbols=${symbols.join(',')}`)
  return JSON.parse(response)
}
