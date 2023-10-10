const get = require('../lib/dvf/get-generic')

module.exports = async (dvf, symbols) => {
  if (symbols.constructor !== Array) {
    symbols = [symbols]
  }

  return get(dvf, `/market-data/tickers?symbols=${symbols.join(',')}`)
}
