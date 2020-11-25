const DVFError = require('../../dvf/DVFError')
const _ = require('lodash')

module.exports = async (dvf, starkOrder) => {
  const starkProvider = dvf.config.starkProvider || null
  if (!starkProvider) {
    throw new DVFError('NO_STARK_PROVIDER')
  }
  const starkPublicKey = await starkProvider.getStarkKey()
  const buySymbol = _.findKey(dvf.config.tokenRegistry, {
    starkTokenId: starkOrder.tokenBuy
  })

  const sellSymbol = _.findKey(dvf.config.tokenRegistry, {
    starkTokenId: starkOrder.tokenSell
  })

  const tokenSellAssetType = await starkProvider.getAssetType({assetStandard: sellSymbol === 'ETH' ? 'ETH' : 'ERC20'})
  const tokenBuyAssetType = await starkProvider.getAssetType({assetStandard: buySymbol === 'ETH' ? 'ETH' : 'ERC20'})
  const starkSignature = await starkProvider.createOrder({
    vaultSell: starkOrder.vaultIdSell,
    vaultBuy: starkOrder.vaultIdBuy,
    amountSell: starkOrder.amountSell,
    amountBuy: starkOrder.amountBuy,
    tokenSellAssetType,
    tokenBuyAssetType,
    nonce: starkOrder.nonce,
    expirationTimestamp: starkOrder.expirationTimestamp
  })

  return {starkPublicKey: {x: starkPublicKey}, starkSignature}
}
