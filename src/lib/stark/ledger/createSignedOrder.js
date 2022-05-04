const Eth = require('@ledgerhq/hw-app-eth').default
const DVFError = require('../../dvf/DVFError')
const BN = require('bignumber.js')
const _findKey = require('lodash/findKey')
const selectTransport = require('../../ledger/selectTransport')
const provideContractData = require('../../ledger/provideContractData')
const getTokenAddressFromTokenInfoOrThrow = require('../../dvf/token/getTokenAddressFromTokenInfoOrThrow')
const swJS = require('starkware_crypto')
const {
  starkLimitOrderToMessageHash
} = require('dvf-utils')

const getPublicKey = async (eth, transport, starkPath) => {
  const tempKey = (await eth.starkGetPublicKey(starkPath)).toString('hex')
  return {
    x: tempKey.substr(2, 64),
    y: tempKey.substr(66)
  }
}

// Use signing on the starkMessage only as a fallback
module.exports = async (dvf, path, starkOrder, { returnStarkPublicKey = true, starkMessage = null } = {}) => {
  const Transport = selectTransport(dvf.isBrowser)

  const buySymbol = _findKey(dvf.config.tokenRegistry, {
    starkTokenId: starkOrder.tokenBuy
  })

  const sellSymbol = _findKey(dvf.config.tokenRegistry, {
    starkTokenId: starkOrder.tokenSell
  })

  const buyTokenInfo = dvf.token.getTokenInfoOrThrow(buySymbol)
  const sellTokenInfo = dvf.token.getTokenInfoOrThrow(sellSymbol)
  const buyQuantization = new BN(buyTokenInfo.quantization)
  const sellQuantization = new BN(sellTokenInfo.quantization)

  const transport = await Transport.create()
  const eth = new Eth(transport)
  let address, starkPublicKey, starkPath
  try {
    ({ address } = await eth.getAddress(path))
    starkPath = dvf.stark.ledger.getPath(address)
    starkPublicKey = returnStarkPublicKey
      ? await getPublicKey(eth, transport, starkPath)
      : null
  } catch (e) {
    await transport.close()
    throw e
  }

  let buyTokenAddress = null
  let sellTokenAddress = null
  try {
    buyTokenAddress = getTokenAddressFromTokenInfoOrThrow(buyTokenInfo, 'ETHEREUM')
    sellTokenAddress = getTokenAddressFromTokenInfoOrThrow(sellTokenInfo, 'ETHEREUM')
    const buySignature = await provideContractData(dvf, eth, buyTokenAddress, buyQuantization, true)
    const sellSignature = await provideContractData(dvf, eth, sellTokenAddress, sellQuantization, true)
    if ((buySignature && buySignature.unsafeSign) || (sellSignature && sellSignature.unsafeSign)) {
      const message = starkMessage || starkLimitOrderToMessageHash(swJS)(starkOrder)
      const paddedMessage = `0x${message.padEnd(64, '0').substr(-64)}`
      const starkSignature = await eth.starkUnsafeSign(
        starkPath,
        paddedMessage
      )
      await transport.close()
      return { starkSignature, starkPublicKey }
    }
  } catch (e) {
    await transport.close()
    throw new DVFError('LEDGER_TOKENINFO_ERR')
  }

  try {
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
  } catch (e) {
    await transport.close()
    throw e
  }
}
