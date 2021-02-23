const P = require('aigle')
const { preparePriceBN, prepareAmountBN, splitSymbol } = require('dvf-utils')
const DVFError = require('../dvf/DVFError')
const computeBuySellData = require('../dvf/computeBuySellData')

module.exports = async (dvf, { symbol, amount, price, validFor, feeRate, nonce, signature }) => {
  price = preparePriceBN(price)
  amount = prepareAmountBN(amount)

  feeRate = parseFloat(feeRate) || dvf.config.DVF.defaultFeeRate

  const symbolArray = splitSymbol(symbol)
  const baseSymbol = symbolArray[0]
  const quoteSymbol = symbolArray[1]

  const amountIsPositive = amount.isGreaterThan(0)
  const buySymbol = amountIsPositive ? baseSymbol : quoteSymbol
  const sellSymbol = amountIsPositive ? quoteSymbol : baseSymbol

  const sellCurrency = dvf.token.getTokenInfo(sellSymbol)
  const buyCurrency = dvf.token.getTokenInfo(buySymbol)

  const [vaultIdSell, vaultIdBuy] = await P.join(
    dvf.getVaultId(sellSymbol, nonce, signature),
    dvf.getVaultId(buySymbol, nonce, signature)
  )
  if (!(sellCurrency && buyCurrency)) {
    if (!vaultIdSell) {
      throw new DVFError('ERR_SYMBOL_DOES_NOT_MATCH')
    }
  }

  const settleSpreadBuy = buyCurrency.settleSpread
  const settleSpreadSell = sellCurrency.settleSpread

  const {
    amountSell,
    amountBuy
  } = computeBuySellData(dvf,{ symbol, amount, price, feeRate, settleSpreadBuy, settleSpreadSell })

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
