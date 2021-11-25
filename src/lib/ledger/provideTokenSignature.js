const byContractAddress = require('@ledgerhq/hw-app-eth/erc20')
  .byContractAddress

module.exports = async (dvf, eth, tokenContractAddress) => {
  if (tokenContractAddress) {
    const sellTokenInfo = byContractAddress(tokenContractAddress)
    const trimmedAddress = tokenContractAddress.substr(2)
    if (sellTokenInfo) {
      await eth.provideERC20TokenInformation(sellTokenInfo)
    } else {
      if (dvf.chainId !== 1) {
        let tokenInfo = {}
        tokenInfo['data'] = Buffer.from(
          `00${trimmedAddress}0000000000000003`,
          'hex'
        )
        try {
          await eth.provideERC20TokenInformation(tokenInfo)
        } catch (e) {
          return { unsafeSign: true }
        }
      } else {
        return { unsafeSign: true }
      }
    }
  }
  return { unsafeSign: false }
}
