const getUSDPrice = require('./getUSDPrice')

module.exports = async (symbol, amount, price) => {
  const quoteSymbol = symbol.split(':')[1]

  quoteSymbolPrice = await getUSDPrice(quoteSymbol)

  // long or short the volume will be the same
  amount = Math.abs(amount)

  return amount * price * quoteSymbolPrice
}
