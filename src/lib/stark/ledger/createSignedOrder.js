const Eth = require('@ledgerhq/hw-app-eth').default
const byContractAddress = require('@ledgerhq/hw-app-eth/erc20')
  .byContractAddress
const DVFError = require('../../dvf/DVFError')
const BN = require('bignumber.js')
const _ = require('lodash')
const selectTransport = require('../../ledger/selectTransport')

module.exports = async (dvf, path, starkOrder) => {
  const Transport = selectTransport(dvf.isBrowser)

  const buyCurrency = _.find(dvf.config.tokenRegistry, {
    starkTokenId: starkOrder.tokenBuy
  })
  const sellCurrency = _.find(dvf.config.tokenRegistry, {
    starkTokenId: starkOrder.tokenSell
  })
  console.log(buyCurrency, sellCurrency)
  const transport = await Transport.create()
  const eth = new Eth(transport)
  const tempKey = (await eth.starkGetPublicKey(path)).toString('hex')
  const starkPublicKey = {
    x: tempKey.substr(2, 64),
    y: tempKey.substr(66)
  }
  console.log(tempKey, starkPublicKey)

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
      if (process.env.NODE_ENV === 'test') {
        let tokenInfo = {}
        tokenInfo['data'] = Buffer.from(
          `00${buyTokenAddress}0000000000000000`,
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
      if (process.env.NODE_ENV === 'test') {
        let tokenInfo = {}
        tokenInfo['data'] = Buffer.from(
          `00${sellTokenAddress}0000000000000000`,
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

  const starkSignature = await eth.starkSignOrder(
    path,
    sellTokenAddress,
    new BN(sellCurrency.tokenization),
    buyTokenAddress,
    new BN(buyCurrency.tokenization),
    starkOrder.vaultSell,
    starkOrder.vaultBuy,
    new BN(starkOrder.amountSell),
    new BN(starkOrder.amountBuy),
    starkOrder.nonce,
    starkOrder.expirationTimestamp
  )

  console.log(starkOrder, starkPublicKey, starkSignature)

  transport.close()

  starkOrderData = { starkPublicKey, starkSignature }

  return starkOrderData
}
