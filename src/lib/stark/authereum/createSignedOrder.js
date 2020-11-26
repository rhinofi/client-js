const DVFError = require('../../dvf/DVFError')
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

  const {r, s} = await starkProvider.createOrder({
    sell: {
      type: sellSymbol === 'ETH' ? 'ETH' : 'ERC20',
      data: {
        quantum: sellCurrency.quantization.toString(),
        tokenAddress: sellCurrency.tokenAddress
      },
      amount: starkOrder.amountSell.toString(),
      vaultId: starkOrder.vaultIdSell.toString()
    },
    buy: {
      type: buySymbol === 'ETH' ? 'ETH' : 'ERC20',
      data: {
        quantum: buyCurrency.quantization.toString(),
        tokenAddress: buyCurrency.tokenAddress
      },
      amount: starkOrder.amountBuy.toString(),
      vaultId: starkOrder.vaultIdBuy.toString()
    },
    nonce: starkOrder.nonce.toString(),
    expirationTimestamp: starkOrder.expirationTimestamp.toString()
  })

  return {
    starkPublicKey,
    starkSignature: {r: r.toString('hex'), s: s.toString('hex')}
  }
}
