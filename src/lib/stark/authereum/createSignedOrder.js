const DVFError = require('../../dvf/DVFError')
const RSV = require('rsv-signature')
const _ = require('lodash')

module.exports = async (dvf, starkOrder) => {
  const starkProvider = dvf.config.starkProvider || null
  if (!starkProvider) {
    throw new DVFError('NO_STARK_PROVIDER')
  }
  const starkPublicKey = await dvf.stark.authereum.getPublicKey()
  const buySymbol = _.findKey(dvf.config.tokenRegistry, {
    starkTokenId: starkOrder.tokenBuy
  })

  const sellSymbol = _.findKey(dvf.config.tokenRegistry, {
    starkTokenId: starkOrder.tokenSell
  })

  const buyCurrency = dvf.config.tokenRegistry[buySymbol]
  const sellCurrency = dvf.config.tokenRegistry[sellSymbol]

  const starkOrderSignature = await starkProvider.createOrder({
    sell: {
      type: sellSymbol === 'ETH' ? 'ETH' : 'ERC20',
      data: {
        quantum: sellCurrency.quantization,
        tokenAddress: sellCurrency.tokenAddress
      },
      amount: starkOrder.amountSell,
      vaultId: starkOrder.vaultIdSell
    },
    buy: {
      type: buySymbol === 'ETH' ? 'ETH' : 'ERC20',
      data: {
        quantum: buyCurrency.quantization,
        tokenAddress: buyCurrency.tokenAddress
      },
      amount: starkOrder.amountBuy,
      vaultId: starkOrder.vaultIdBuy
    },
    nonce: starkOrder.nonce,
    expirationTimestamp: starkOrder.expirationTimestamp
  })

  const starkSignature = RSV.deserializeSignature(starkOrderSignature, 63)

  return {starkPublicKey, starkSignature}
}
