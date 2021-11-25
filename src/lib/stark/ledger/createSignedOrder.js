const Eth = require('@ledgerhq/hw-app-eth').default
const DVFError = require('../../dvf/DVFError')
const BN = require('bignumber.js')
const _ = require('lodash')
const selectTransport = require('../../ledger/selectTransport')
const provideTokenSignature = require('../../ledger/provideTokenSignature')
const getTokenAddressFromTokenInfoOrThrow = require('../../dvf/token/getTokenAddressFromTokenInfoOrThrow')

const getPublicKey = async (eth, starkPath) => {
  const tempKey = (await eth.starkGetPublicKey(starkPath)).toString('hex')
  return {
    x: tempKey.substr(2, 64),
    y: tempKey.substr(66)
  }
}

// Use signing on the starkMessage only as a fallback
module.exports = async (dvf, path, starkOrder, { returnStarkPublicKey = true, starkMessage = null } = {}) => {
  const Transport = selectTransport(dvf.isBrowser)

  const buySymbol = _.findKey(dvf.config.tokenRegistry, {
    starkTokenId: starkOrder.tokenBuy
  })

  const sellSymbol = _.findKey(dvf.config.tokenRegistry, {
    starkTokenId: starkOrder.tokenSell
  })

  const buyTokenInfo = dvf.token.getTokenInfoOrThrow(buySymbol)
  const sellTokenInfo = dvf.token.getTokenInfoOrThrow(sellSymbol)

  const transport = await Transport.create()
  const eth = new Eth(transport)
  const { address } = await eth.getAddress(path)
  const starkPath = dvf.stark.ledger.getPath(address)

  const starkPublicKey = returnStarkPublicKey
    ? await getPublicKey(eth, starkPath)
    : null

  let buyTokenAddress = null
  let sellTokenAddress = null
  try {
    buyTokenAddress = getTokenAddressFromTokenInfoOrThrow(buyTokenInfo, 'ETHEREUM')
    sellTokenAddress = getTokenAddressFromTokenInfoOrThrow(sellTokenInfo, 'ETHEREUM')
    const [buySignature, sellSignature] = await Promise.all([
      provideTokenSignature(dvf, eth, buyTokenAddress),
      provideTokenSignature(dvf, eth, sellTokenAddress)
    ])
    if (buySignature.unsafeSign || sellSignature.unsafeSign) {
      const starkSignature = await eth.starkUnsafeSign(
        starkPath,
        starkMessage.padStart(64, '0').substr(-64)
      )
      await transport.close()
      return { starkSignature, starkPublicKey }
    }
  } catch (e) {
    await transport.close()
    throw new DVFError('LEDGER_TOKENINFO_ERR')
  }

  const starkSignature = await eth.starkSignOrder_v2(
    starkPath,
    sellTokenAddress,
    sellSymbol === 'ETH' ? 'eth' : 'erc20',
    new BN(sellTokenInfo.quantization),
    null,
    buyTokenAddress,
    buySymbol === 'ETH' ? 'eth' : 'erc20',
    new BN(buyTokenInfo.quantization),
    null,
    starkOrder.vaultIdSell,
    starkOrder.vaultIdBuy,
    new BN(starkOrder.amountSell),
    new BN(starkOrder.amountBuy),
    starkOrder.nonce,
    starkOrder.expirationTimestamp
  )
  await transport.close()
  return { starkPublicKey, starkSignature }
}
