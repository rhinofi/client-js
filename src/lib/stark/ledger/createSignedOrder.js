const Eth = require('@ledgerhq/hw-app-eth').default
const { byContractAddress } = require('@ledgerhq/hw-app-eth/erc20')
const DVFError = require('../../dvf/DVFError')
const BN = require('bignumber.js')
const _ = require('lodash')
const selectTransport = require('../../ledger/selectTransport')
const getTokenAddressFromTokenInfoOrThrow = require('../../dvf/token/getTokenAddressFromTokenInfoOrThrow')
const generateTestNetworkTokenData = require('../../ledger/generateTestNetworkTokenData')

const getPublicKey = async (eth, starkPath) => {
  const tempKey = (await eth.starkGetPublicKey(starkPath)).toString('hex')
  return {
    x: tempKey.substr(2, 64),
    y: tempKey.substr(66)
  }
}

module.exports = async (dvf, path, starkOrder, { returnStarkPublicKey = true } = {}) => {
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
  const {address} = await eth.getAddress(path)
  const starkPath = dvf.stark.ledger.getPath(address)

  const starkPublicKey = returnStarkPublicKey
    ? await getPublicKey(eth, starkPath)
    : null

  try {
    // TODO Extract below code to a utility method
    // to be used for both buy as sell tokens and
    // for transfer method as well as well

    let buyTokenAddress = getTokenAddressFromTokenInfoOrThrow(buyTokenInfo, 'ETHEREUM')
    if (buyTokenAddress) {
      const buyTokenInfo = byContractAddress(buyTokenAddress)
      buyTokenAddress = buyTokenAddress.substr(2)
      if (buyTokenInfo) {
        await eth.provideERC20TokenInformation(buyTokenInfo)
      } else {
        if (buyTokenAddress === 'dddddd4301a082e62e84e43f474f044423921918') {
          await eth.provideERC20TokenInformation({
            data: Buffer.from(
              `03445646DDdddd4301A082e62E84e43F474f04442392191800000012000000013045022100bd8a55c10b02bbe70f7266be7f5f5e7132140623b6de3fa27bdd820f11baa0d902207eb91acba7c2c5131d8285f9eba2f0d06bc9be3b4dfc29d05b0f25aa3b620a41`,
              'hex'
            )
          })
        } else if (buyTokenAddress === 'dddd0e38d30dd29c683033fa0132f868597763ab') {
          await eth.provideERC20TokenInformation({
            data: Buffer.from(
              `0478445646dddd0e38d30dd29c683033fa0132f868597763ab00000012000000013045022100b6a0d84315a9935d0245336bb12ef30fc4b4592d30407f33ab695f01fc445eef02200a74e7ee316e753e127de5e05a3fefade56b025a7c84d107594808582399872d`,
              'hex'
            )
          })
        } else if (buyTokenAddress === '0a0e3bfd5a8ce610e735d4469bc1b3b130402267') {
          await eth.provideERC20TokenInformation({
            data: Buffer.from(
              '034552500a0e3bfd5a8ce610e735d4469bc1b3b1304022670000001200000001304402204fc34364bdba254200371327e2f6cff6f6e07f488ee6d71f95499429be6e76fc02201d222d7c93a395bed86f9e0cf1b8b3f6fabec8535807d013783a9201fec30531',
              'hex'
            )
          })
        } else if (dvf.config.ethereumChainId !== 1) {
          const tokenData = generateTestNetworkTokenData(buyTokenAddress, dvf.config.ethereumChainId)
          await eth.provideERC20TokenInformation(tokenData)
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

    let sellTokenAddress = getTokenAddressFromTokenInfoOrThrow(sellTokenInfo, 'ETHEREUM')
    if (sellTokenAddress) {
      const sellTokenInfo = byContractAddress(sellTokenAddress)
      sellTokenAddress = sellTokenAddress.substr(2)
      if (sellTokenInfo) {
        await eth.provideERC20TokenInformation(sellTokenInfo)
      } else {
        if (sellTokenAddress === 'dddddd4301a082e62e84e43f474f044423921918') {
          await eth.provideERC20TokenInformation({
            data: Buffer.from(
              `03445646DDdddd4301A082e62E84e43F474f04442392191800000012000000013045022100bd8a55c10b02bbe70f7266be7f5f5e7132140623b6de3fa27bdd820f11baa0d902207eb91acba7c2c5131d8285f9eba2f0d06bc9be3b4dfc29d05b0f25aa3b620a41`,
              'hex'
            )
          })
        } else if (sellTokenAddress === 'dddd0e38d30dd29c683033fa0132f868597763ab') {
          await eth.provideERC20TokenInformation({
            data: Buffer.from(
              `0478445646dddd0e38d30dd29c683033fa0132f868597763ab00000012000000013045022100b6a0d84315a9935d0245336bb12ef30fc4b4592d30407f33ab695f01fc445eef02200a74e7ee316e753e127de5e05a3fefade56b025a7c84d107594808582399872d`,
              'hex'
            )
          })
        } else if (sellTokenAddress === '0a0e3bfd5a8ce610e735d4469bc1b3b130402267') {
          await eth.provideERC20TokenInformation({
            data: Buffer.from(
              '034552500a0e3bfd5a8ce610e735d4469bc1b3b1304022670000001200000001304402204fc34364bdba254200371327e2f6cff6f6e07f488ee6d71f95499429be6e76fc02201d222d7c93a395bed86f9e0cf1b8b3f6fabec8535807d013783a9201fec30531',
              'hex'
            )
          })
        } else if (dvf.config.ethereumChainId !== 1) {
          const tokenData = generateTestNetworkTokenData(sellTokenAddress, dvf.config.ethereumChainId)
          await eth.provideERC20TokenInformation(tokenData)
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
    return { starkPublicKey, starkSignature }
  } finally {
    await transport.close()
  }
}
