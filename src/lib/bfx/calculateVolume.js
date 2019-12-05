const getUSDPrice = require('./getUSDPrice')

module.exports = async (symbol, amount, price) => {
  const baseSymbol = symbol.substr(0, symbol.length - 3)
  const quoteSymbol = symbol.substr(-3)

  quoteSymbolPrice = await getUSDPrice(quoteSymbol)

  // long or short the volume will be the same
  amount = Math.abs(amount)

  return amount * price * quoteSymbolPrice
}