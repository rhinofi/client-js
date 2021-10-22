const byContractAddress = require('@ledgerhq/hw-app-eth/erc20').byContractAddress
const Eth = require('@ledgerhq/hw-app-eth').default
const selectTransport = require('./selectTransport')
const generateTestNetworkTokenData = require('./generateTestNetworkTokenData')
const DVFError = require('../dvf/DVFError')

module.exports = async (dvf, transport, tokenAddress = '', transferQuantization) => {
  let _transport = transport || null
  let createdTransport = null
  if (!transport) {
    const selectedTransport = selectTransport(dvf.isBrowser)
    createdTransport = await selectedTransport.create()
    _transport = new Eth(createdTransport)
  }

  try {
    let transferTokenAddress = tokenAddress.slice(0, 2) === '0x' ? tokenAddress.substr(2) : tokenAddress
    if (transferTokenAddress) {
      const tokenInfo = byContractAddress(`0x${transferTokenAddress}`)
      if (tokenInfo) {
        await _transport.provideERC20TokenInformation(tokenInfo)
      } else {
        if (transferTokenAddress === 'dddddd4301a082e62e84e43f474f044423921918') {
          await _transport.provideERC20TokenInformation({
            data: Buffer.from(
              `03445646DDdddd4301A082e62E84e43F474f04442392191800000012000000013045022100bd8a55c10b02bbe70f7266be7f5f5e7132140623b6de3fa27bdd820f11baa0d902207eb91acba7c2c5131d8285f9eba2f0d06bc9be3b4dfc29d05b0f25aa3b620a41`,
              'hex'
            )
          })
        } else if (transferTokenAddress === 'dddd0e38d30dd29c683033fa0132f868597763ab') {
          await _transport.provideERC20TokenInformation({
            data: Buffer.from(
              `3045022100b6a0d84315a9935d0245336bb12ef30fc4b4592d30407f33ab695f01fc445eef02200a74e7ee316e753e127de5e05a3fefade56b025a7c84d107594808582399872d`,
              'hex'
            )
          })
        } else if (dvf.config.ethereumChainId !== 1) {
          const tokenData = generateTestNetworkTokenData(transferTokenAddress, dvf.config.ethereumChainId)
          await _transport.provideERC20TokenInformation(tokenData)
        } else {
          throw new DVFError('LEDGER_TOKENINFO_ERR')
        }
      }
    } else {
      transferTokenAddress = null
    }
    if (transferQuantization) {
      await _transport.starkProvideQuantum_v2(transferTokenAddress, tokenAddress ? 'erc20' : 'eth', transferQuantization, null)
    }
  } finally {
    if (createdTransport) {
      await createdTransport.close()
    }
  }
}
