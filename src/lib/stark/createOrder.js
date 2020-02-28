const BigNumber = require('bignumber.js')
const DVFError = require('../dvf/DVFError')

module.exports = (dvf, symbol, amount, price, validFor, feeRate = 0.0025) => {
  // symbols are always 3 letters
  const baseSymbol = symbol.split(':')[0]
  const quoteSymbol = symbol.split(':')[1]

  const buySymbol = amount > 0 ? baseSymbol : quoteSymbol
  const sellSymbol = amount > 0 ? quoteSymbol : baseSymbol

  const sellCurrency = dvf.token.getTokenInfo(sellSymbol)
  const buyCurrency = dvf.token.getTokenInfo(buySymbol)
  const vaultIdSell = sellCurrency.starkVaultId

  // console.log("sell :", sellSymbol, sellCurrency)
  // console.log("buy  :", buySymbol, buyCurrency)

  if (!vaultIdSell) {
    console.error('No token vault for :', sellSymbol)

    throw new DVFError('ERR_NO_TOKEN_VAULT')
  }

  let vaultIdBuy = buyCurrency.starkVaultId
  if (!vaultIdBuy) {
    vaultIdBuy = dvf.config.spareStarkVaultId
  }

  if (!(sellCurrency && buyCurrency)) {
    if (!vaultIdSell) {
      throw new DVFError('ERR_SYMBOL_DOES_NOT_MATCH')
    }
  }

  let buyAmount, sellAmount

  if (amount > 0) {
    buyAmount = new BigNumber(10)
      .pow(buyCurrency.decimals)
      .times(amount)
      .dividedBy(buyCurrency.quantization)
      .times(1 + (buyCurrency.settleSpread || 0))
      .times(1 - feeRate)
      .integerValue(BigNumber.ROUND_CIEL)
      .abs()
      .toString()
    sellAmount = new BigNumber(10)
      .pow(sellCurrency.decimals)
      .times(amount)
      .dividedBy(sellCurrency.quantization)
      .times(price)
      .times(1 + (sellCurrency.settleSpread || 0))
      .integerValue(BigNumber.ROUND_FLOOR)
      .abs()
      .toString()
  }

  if (amount < 0) {
    buyAmount = new BigNumber(10)
      .pow(buyCurrency.decimals)
      .dividedBy(buyCurrency.quantization)
      .times(amount)
      .times(price)
      .times(1 + (buyCurrency.settleSpread || 0))
      .times(1 - feeRate)
      .integerValue(BigNumber.ROUND_CIEL)
      .abs()
      .toString()
    sellAmount = new BigNumber(10)
      .pow(sellCurrency.decimals)
      .dividedBy(sellCurrency.quantization)
      .times(amount)
      .times(1 + (sellCurrency.settleSpread || 0))
      .integerValue(BigNumber.ROUND_FLOOR)
      .abs()
      .toString()
  }

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
    amountSell: sellAmount,
    amountBuy: buyAmount,
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
