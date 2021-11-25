const Eth = require('@ledgerhq/hw-app-eth').default
const byContractAddress = require('@ledgerhq/hw-app-eth/erc20')
  .byContractAddress
const BN = require('bignumber.js')
const _ = require('lodash')
const selectTransport = require('../../ledger/selectTransport')
const provideTokenSignature = require('../../ledger/provideTokenSignature')

// Use signing on the starkMessage only as a fallback
module.exports = async (dvf, path, starkOrder, starkMessage) => {
  const Transport = selectTransport(dvf.isBrowser)

  const buyCurrency = _.find(dvf.config.tokenRegistry, {
    starkTokenId: starkOrder.tokenBuy
  })
  const sellCurrency = _.find(dvf.config.tokenRegistry, {
    starkTokenId: starkOrder.tokenSell
  })

  const transport = await Transport.create()
  const eth = new Eth(transport)
  const { address } = await eth.getAddress(path)
  const starkPath = dvf.stark.ledger.getPath(address)
  const tempKey = (await eth.starkGetPublicKey(starkPath)).toString('hex')
  let starkPublicKey = {
    x: tempKey.substr(2, 64),
    y: tempKey.substr(66)
  }

  // TODO Extract below code to a utility method
  // to be used for both buy as sell tokens and
  // for transfer method as well as well

  const buyTokenAddress = buyCurrency.tokenAddress
  const sellTokenAddress = sellCurrency.tokenAddress
  const [buyToken, sellToken] = await Promise.all([
    await provideTokenSignature(dvf, eth, buyTokenAddress),
    await provideTokenSignature(dvf, eth, sellTokenAddress)
  ])

  if (buyToken.unsafeSign || sellToken.unsafeSign) {
    console.log('SIGN UNSAFELY')
    const starkSignature = await eth.starkUnsafeSign(
      starkPath,
      starkMessage
    )
    await transport.close()
    return { starkPublicKey, starkSignature }
  }

  const starkSignature = await eth.starkSignOrder(
    starkPath,
    sellTokenAddress,
    new BN(sellCurrency.quantization),
    buyTokenAddress,
    new BN(buyCurrency.quantization),
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
