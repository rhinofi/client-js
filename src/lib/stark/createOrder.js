const P = require('aigle')
const { preparePrice, prepareAmount } = require('bfx-api-node-util')
const toBN = require('../util/toBN')
const DVFError = require('../dvf/DVFError')
const computeBuySellData = require('../dvf/computeBuySellData')


module.exports = async (dvf, { symbol, amount, price, validFor, feeRate }) => {
  console.log('price', price)
  price = toBN(preparePrice(price))
  amount = toBN(prepareAmount(amount))

  feeRate = parseFloat(feeRate) || dvf.config.DVF.defaultFeeRate
  // symbols are always 3 letters
  const baseSymbol = symbol.split(':')[0]
  const quoteSymbol = symbol.split(':')[1]

  const amountIsPositive = amount.isGreaterThan(0)
  const buySymbol = amountIsPositive ? baseSymbol : quoteSymbol
  const sellSymbol = amountIsPositive ? quoteSymbol : baseSymbol

  const sellCurrency = dvf.token.getTokenInfo(sellSymbol)
  const buyCurrency = dvf.token.getTokenInfo(buySymbol)

  const [vaultIdSell, vaultIdBuy] = await P.join(
    dvf.getVaultId(sellSymbol),
    dvf.getVaultId(buySymbol)
  )
  if (!(sellCurrency && buyCurrency)) {
    if (!vaultIdSell) {
      throw new DVFError('ERR_SYMBOL_DOES_NOT_MATCH')
    }
  }

  const {
    amountSell,
    amountBuy
  } = computeBuySellData(dvf,{ symbol, amount, price, feeRate })

  // console.log('sell :', sellSymbol, sellCurrency)
  // console.log('buy  :', buySymbol, buyCurrency)

  let expiration // in hours
  expiration = Math.floor(Date.now() / (1000 * 3600))

  if (validFor) {
    expiration += parseInt(validFor)
  } else {
    expiration += parseInt(dvf.config.defaultStarkExpiry)
  }

  const starkOrder = {
    vaultIdSell: vaultIdSell,
    vaultIdBuy: vaultIdBuy,
    amountSell,
    amountBuy,
    tokenSell: sellCurrency.starkTokenId,
    tokenBuy: buyCurrency.starkTokenId,
    nonce: dvf.util.generateRandomNonce(),
    expirationTimestamp: expiration
  }
  //console.log('stark order: ', starkOrder)
  const starkMessage = dvf.stark.createOrderMessage(starkOrder)

  return {
    starkOrder: starkOrder,
    starkMessage: starkMessage
  }
}
