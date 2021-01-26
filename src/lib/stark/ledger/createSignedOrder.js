const Eth = require('@ledgerhq/hw-app-eth').default
const byContractAddress = require('@ledgerhq/hw-app-eth/erc20')
  .byContractAddress
const DVFError = require('../../dvf/DVFError')
const BN = require('bignumber.js')
const _ = require('lodash')
const selectTransport = require('../../ledger/selectTransport')

module.exports = async (dvf, path, starkOrder) => {
  const Transport = selectTransport(dvf.isBrowser)

  const buySymbol = _.findKey(dvf.config.tokenRegistry, {
    starkTokenId: starkOrder.tokenBuy
  })

  const sellSymbol = _.findKey(dvf.config.tokenRegistry, {
    starkTokenId: starkOrder.tokenSell
  })

  const buyCurrency = dvf.config.tokenRegistry[buySymbol]
  const sellCurrency = dvf.config.tokenRegistry[sellSymbol]

  const transport = await Transport.create()
  const eth = new Eth(transport)
  const {address} = await eth.getAddress(path)
  const starkPath = dvf.stark.ledger.getPath(address)
  const tempKey = (await eth.starkGetPublicKey(starkPath)).toString('hex')
  let starkPublicKey = {
    x: tempKey.substr(2, 64),
    y: tempKey.substr(66)
  }

  // TODO Extract below code to a utility method
  // to be used for both buy as sell tokens and
  // for transfer method as well as well

  let buyTokenAddress = buyCurrency.tokenAddress

  if (buyTokenAddress) {
    const buyTokenInfo = byContractAddress(buyTokenAddress)
    buyTokenAddress = buyTokenAddress.substr(2)
    if (buyTokenInfo) {
      await eth.provideERC20TokenInformation(buyTokenInfo)
    } else {
      if (dvf.chainId !== 1) {
        let tokenInfo = {}
        tokenInfo['data'] = Buffer.from(
          `00${buyTokenAddress}0000000000000003`,
          'hex'
        )
        await eth.provideERC20TokenInformation(tokenInfo)
      } else {
        throw new DVFError('LEDGER_TOKENINFO_ERR')
      }
    }
  } else {
    buyTokenAddress = null
  }

  // TODO Extract below code to a utility method
  // to be used for both buy as sell tokens and
  // for transfer method as well as well

  let sellTokenAddress = sellCurrency.tokenAddress
  if (sellTokenAddress) {
    const sellTokenInfo = byContractAddress(sellTokenAddress)
    sellTokenAddress = sellTokenAddress.substr(2)
    if (sellTokenInfo) {
      await eth.provideERC20TokenInformation(sellTokenInfo)
    } else {
      if (dvf.chainId !== 1) {
        let tokenInfo = {}
        tokenInfo['data'] = Buffer.from(
          `00${sellTokenAddress}0000000000000003`,
          'hex'
        )
        await eth.provideERC20TokenInformation(tokenInfo)
      } else {
        throw new DVFError('LEDGER_TOKENINFO_ERR')
      }
    }
  } else {
    sellTokenAddress = null
  }

  const starkSignature = await eth.starkSignOrder_v2(
      starkPath,
      sellTokenAddress,
      sellSymbol === 'ETH' ? 'eth' : 'erc20',
      new BN(sellCurrency.quantization),
      null,
      buyTokenAddress,
      buySymbol === 'ETH' ? 'eth' : 'erc20',
      new BN(buyCurrency.quantization),
      null,
      starkOrder.vaultIdSell,
      starkOrder.vaultIdBuy,
      new BN(starkOrder.amountSell),
      new BN(starkOrder.amountBuy),
      starkOrder.nonce,
      starkOrder.expirationTimestamp
    )

  await transport.close()

  return {starkPublicKey, starkSignature}
}
