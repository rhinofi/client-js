const BigNumber = require('bignumber.js')
const sw = require('starkware_crypto')

module.exports = (dvf, symbol, amount, price, validFor, feeRate = 0.0025) => {
  // symbols are always 3 letters
  const baseSymbol = symbol.split(':')[0]
  const quoteSymbol = symbol.split(':')[1]

  const buySymbol = amount > 0 ? baseSymbol : quoteSymbol
  const sellSymbol = amount > 0 ? quoteSymbol : baseSymbol

  const sellCurrency = dvf.config.tokenRegistry[sellSymbol]
  const buyCurrency = dvf.config.tokenRegistry[buySymbol]
  const vaultIdSell = sellCurrency.starkVaultId
  const vaultIdBuy = buyCurrency.starkVaultId

  if (!(sellCurrency && buyCurrency)) {
    throw new Error(`Symbol does not match`)
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
    // console.log( "Buying " + amount + ' ' + buySymbol + " for: " + price + ' ' + sellSymbol )
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
    // console.log( "Selling " + Math.abs(amount) + ' ' + sellSymbol + " for: " + price + ' ' + buySymbol )
  }

  let expiration
  expiration = Math.floor(Date.now() / (1000 * 3600))
  expiration += parseInt(validFor || dvf.config.defaultExpiry)

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
  // console.log('stark order: ', starkOrder)
  let starkMessage = ''
  try {
    starkMessage = sw.get_limit_order_msg(
      vaultIdSell, // vault_sell (uint31)
      vaultIdBuy, // vault_buy (uint31)
      starkOrder.amountSell, // amount_sell (uint63 decimal str)
      starkOrder.amountBuy, // amount_buy (uint63 decimal str)
      starkOrder.tokenSell, // token_sell (hex str with 0x prefix < prime)np
      starkOrder.tokenBuy, // token_buy (hex str with 0x prefix < prime)
      starkOrder.nonce, // nonce (uint31)
      starkOrder.expirationTimestamp // expiration_timestamp (uint22)
    )
    // Create stark message for order
  } catch (e) {
    throw `unable to create stark order message: ${e}`
  }
  return {
    starkOrder: starkOrder,
    starkMessage: starkMessage
  }
}
