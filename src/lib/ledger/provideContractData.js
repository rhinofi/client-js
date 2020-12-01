const byContractAddress = require('@ledgerhq/hw-app-eth/erc20').byContractAddress
const DVFError = require('../dvf/DVFError')

module.exports = async (dvf, transport, token, tokenAddress = '', transferQuantization) => {
  let transferTokenAddress = tokenAddress.slice(0, 2) === '0x' ? tokenAddress.substr(2) : tokenAddress
  if (transferTokenAddress) {
    const tokenInfo = byContractAddress(`0x${transferTokenAddress}`)
    if (tokenInfo) {
      await transport.provideERC20TokenInformation(tokenInfo)
    } else {
      if (dvf.chainId !== 1) {
        await transport.provideERC20TokenInformation({
          data: Buffer.from(
            `00${transferTokenAddress}0000000000000003`,
            'hex'
          )
        })
      } else {
        throw new DVFError('LEDGER_TOKENINFO_ERR')
      }
    }
  } else {
    transferTokenAddress = null
  }
  if (transferQuantization) {
    dvf.config.starkExUseV2
      ? await transport.starkProvideQuantum_v2(transferTokenAddress, token === 'ETH' ? 'eth' : 'erc20', transferQuantization, null)
      : await transport.starkProvideQuantum(transferTokenAddress, transferQuantization)
  }
}
