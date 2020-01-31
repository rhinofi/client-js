const BigNumber = require('bignumber.js')
const errorReasons = require('.././../lib/error/reasons')

module.exports = (dvf, symbol, amount, price, validFor, feeRate = 0.0025) => {
  // symbols are always 3 letters
  const baseSymbol = symbol.split(':')[0]
  const quoteSymbol = symbol.split(':')[1]

  const buySymbol = amount > 0 ? baseSymbol : quoteSymbol
  const sellSymbol = amount > 0 ? quoteSymbol : baseSymbol

  const sellCurrency = dvf.config.tokenRegistry[sellSymbol]
  const buyCurrency = dvf.config.tokenRegistry[buySymbol]
  const vaultIdSell = sellCurrency.starkVaultId
  if (!vaultIdSell) {
    return {
      error: 'ERR_NO_TOKEN_VAULT',
      reason: errorReasons.ERR_NO_TOKEN_VAULT
    }
  }
  let vaultIdBuy = buyCurrency.starkVaultId
  if (!vaultIdBuy) {
    vaultIdBuy = dvf.config.spareStarkVaultId
  }

  if (!(sellCurrency && buyCurrency)) {
    return {
      error: 'ERR_SYMBOL_DOES_NOT_MATCH',
      reason: errorReasons.ERR_SYMBOL_DOES_NOT_MATCH
    }
  }
  let buyAmount, sellAmount

  if (amount > 0) {
    buyAmount = new BigNumber(10)
      .pow(buyCurrency.decimals)
      .times(amount)
      .times(1 + (buyCurrency.settleSpread || 0))
      .times(1 - feeRate)
      .integerValue(BigNumber.ROUND_FLOOR)
    sellAmount = new BigNumber(10)
      .pow(sellCurrency.decimals)
      .times(amount)
      .times(price)
      .times(1 + (sellCurrency.settleSpread || 0))
      .integerValue(BigNumber.ROUND_FLOOR)
  }

  if (amount < 0) {
    buyAmount = new BigNumber(10)
      .pow(buyCurrency.decimals)
      .times(amount)
      .times(price)
      .abs()
      .times(1 + (buyCurrency.settleSpread || 0))
      .times(1 - feeRate)
      .integerValue(BigNumber.ROUND_FLOOR)
    sellAmount = new BigNumber(10)
      .pow(sellCurrency.decimals)
      .times(amount)
      .abs()
      .times(1 + (sellCurrency.settleSpread || 0))
      .integerValue(BigNumber.ROUND_FLOOR)
  }

  let expiration // in hours
  expiration = Math.floor(Date.now() / (1000 * 3600))
  expiration += parseInt(validFor || dvf.config.defaultStarkExpiry)

  const starkOrder = {
    vaultIdSell: vaultIdSell,
    vaultIdBuy: vaultIdBuy,
    amountSell: sellAmount
      .integerValue()
      .abs()
      .toString(),
    amountBuy: buyAmount
      .integerValue()
      .abs()
      .toString(),
    tokenSell: sellCurrency.starkTokenId,
    tokenBuy: buyCurrency.starkTokenId,
    nonce: 0,
    expirationTimestamp: expiration
  }
  //console.log('stark order: ', starkOrder)
  const starkMessage = dvf.stark.createOrderMessage(starkOrder)

  return {
    starkOrder: starkOrder,
    starkMessage: starkMessage
  }
}
