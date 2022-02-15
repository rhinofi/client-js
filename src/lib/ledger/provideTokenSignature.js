const { byContractAddressAndChainId } = require('@ledgerhq/hw-app-eth/erc20')
const generateTestNetworkTokenData = require('../ledger/generateTestNetworkTokenData')

module.exports = async (dvf, eth, tokenContractAddress) => {
  if (tokenContractAddress) {
    const sellTokenInfo = byContractAddressAndChainId(tokenContractAddress, dvf.config.ethereumChainId)
    const trimmedAddress = tokenContractAddress.substr(2)
    if (sellTokenInfo) {
      await eth.provideERC20TokenInformation(sellTokenInfo)
    } else {
      if (trimmedAddress === 'dddddd4301a082e62e84e43f474f044423921918') {
        await eth.provideERC20TokenInformation({
          data: Buffer.from(
            `03445646DDdddd4301A082e62E84e43F474f04442392191800000012000000013045022100bd8a55c10b02bbe70f7266be7f5f5e7132140623b6de3fa27bdd820f11baa0d902207eb91acba7c2c5131d8285f9eba2f0d06bc9be3b4dfc29d05b0f25aa3b620a41`,
            'hex'
          )
        })
      } else if (trimmedAddress === 'dddd0e38d30dd29c683033fa0132f868597763ab') {
        await eth.provideERC20TokenInformation({
          data: Buffer.from(
            `0478445646dddd0e38d30dd29c683033fa0132f868597763ab00000012000000013045022100b6a0d84315a9935d0245336bb12ef30fc4b4592d30407f33ab695f01fc445eef02200a74e7ee316e753e127de5e05a3fefade56b025a7c84d107594808582399872d`,
            'hex'
          )
        })
      } else if (trimmedAddress === '0a0e3bfd5a8ce610e735d4469bc1b3b130402267') {
        await eth.provideERC20TokenInformation({
          data: Buffer.from(
            '034552500a0e3bfd5a8ce610e735d4469bc1b3b1304022670000001200000001304402204fc34364bdba254200371327e2f6cff6f6e07f488ee6d71f95499429be6e76fc02201d222d7c93a395bed86f9e0cf1b8b3f6fabec8535807d013783a9201fec30531',
            'hex'
          )
        })
      } else if (dvf.config.ethereumChainId !== 1) {
        const tokenData = generateTestNetworkTokenData(trimmedAddress, dvf.config.ethereumChainId)
        try {
          await eth.provideERC20TokenInformation(tokenData)
        } catch (e) {
          return { unsafeSign: true }
        }
      } else {
        return { unsafeSign: true }
      }
    }
  }
}
