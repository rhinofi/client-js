const { request } = require('@rhino.fi/dvf-utils')

module.exports = async (dvf, symbols) => {
  if (symbols.constructor !== Array) {
    symbols = [symbols]
  }

  const response = await request.get(`${dvf.config.api}/market-data/tickers?symbols=${symbols.join(',')}`)
  return JSON.parse(response)
}
