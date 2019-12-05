const {assetDataUtils, generatePseudoRandomSalt} = require('@0x/order-utils')
const BigNumber = require('bignumber.js');

module.exports = (efx, symbol, amount, price, validFor, fee_rate = 0.0025) => {
  const { web3, config } = efx

  if(fee_rate < 0 || fee_rate > 0.05 || isNaN(fee_rate)){
    // use 0.0025 for 0.25% fee
    // use 0.01   for 1% fee
    // use 0.05   for 5% fee
    throw('fee_rate should be between 0 and 0.05')
  }

  // symbols are always 3 letters
  const baseSymbol = symbol.substr(0, symbol.length - 3)
  const quoteSymbol = symbol.substr(-3)

  const buySymbol = amount > 0 ? baseSymbol : quoteSymbol
  const sellSymbol = amount > 0 ? quoteSymbol : baseSymbol

  const sellCurrency = efx.config['0x'].tokenRegistry[sellSymbol]
  const buyCurrency = efx.config['0x'].tokenRegistry[buySymbol]

  let buyAmount, sellAmount

  if (amount > 0) {
    buyAmount = (new BigNumber(10))
      .pow(buyCurrency.decimals)
      .times(amount)
      .times(1 + (buyCurrency.settleSpread || 0))
      .times(1 - fee_rate)
      .integerValue(BigNumber.ROUND_FLOOR)

    sellAmount = (new BigNumber(10))
      .pow(sellCurrency.decimals)
      .times(amount)
      .times(price)
      .times(1 + (sellCurrency.settleSpread || 0))
      .integerValue(BigNumber.ROUND_FLOOR)

    // console.log( "Buying " + amount + ' ' + buySymbol + " for: " + price + ' ' + sellSymbol )
  }

  if (amount < 0) {
    buyAmount = (new BigNumber(10))
      .pow(buyCurrency.decimals)
      .times(amount)
      .times(price)
      .abs()
      .times(1 + (buyCurrency.settleSpread || 0))
      .times(1 - fee_rate)
      .integerValue(BigNumber.ROUND_FLOOR)

    sellAmount = (new BigNumber(10))
      .pow(sellCurrency.decimals)
      .times(amount)
      .abs()
      .times(1 + (sellCurrency.settleSpread || 0))
      .integerValue(BigNumber.ROUND_FLOOR)

    // console.log( "Selling " + Math.abs(amount) + ' ' + sellSymbol + " for: " + price + ' ' + buySymbol )
  }

  let expiration
  expiration = Math.round((new Date()).getTime() / 1000)
  expiration += validFor || config.defaultExpiry

  // create order object
  const order = {
    makerAddress: efx.get('account').toLowerCase(),
    takerAddress: '0x0000000000000000000000000000000000000000',

    feeRecipientAddress: efx.config['0x'].ethfinexAddress.toLowerCase(),
    senderAddress: efx.config['0x'].ethfinexAddress.toLowerCase(),

    makerAssetAmount: sellAmount,

    takerAssetAmount: buyAmount,

    makerFee: new BigNumber(0),

    takerFee: new BigNumber(0),

    expirationTimeSeconds: new BigNumber(expiration),

    salt: generatePseudoRandomSalt(),

    makerAssetData: assetDataUtils.encodeERC20AssetData(sellCurrency.wrapperAddress.toLowerCase()),

    takerAssetData: assetDataUtils.encodeERC20AssetData(buyCurrency.wrapperAddress.toLowerCase()),

    exchangeAddress: efx.config['0x'].exchangeAddress.toLowerCase()
  }

  return order
}
