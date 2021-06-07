const byContractAddress = require('@ledgerhq/hw-app-eth/erc20').byContractAddress
const Eth = require('@ledgerhq/hw-app-eth').default
const selectTransport = require('./selectTransport')

const DVFError = require('../dvf/DVFError')

module.exports = async (dvf, transport, tokenAddress = '', transferQuantization) => {
  let _transport = transport || null
  let createdTransport = null
  if (!transport) {
    const selectedTransport = selectTransport(dvf.isBrowser)
    createdTransport = await selectedTransport.create()
    _transport = new Eth(createdTransport)
  }

  let transferTokenAddress = tokenAddress.slice(0, 2) === '0x' ? tokenAddress.substr(2) : tokenAddress
  if (transferTokenAddress) {
    const tokenInfo = byContractAddress(`0x${transferTokenAddress}`)
    if (tokenInfo) {
      await _transport.provideERC20TokenInformation(tokenInfo)
    } else {
      if (dvf.chainId !== 1) {
        await _transport.provideERC20TokenInformation({
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
    await _transport.starkProvideQuantum_v2(transferTokenAddress, tokenAddress ? 'erc20' : 'eth', transferQuantization, null)
  }
  if (createdTransport) {
    await createdTransport.close()
  }
}
