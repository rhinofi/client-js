const DVFError = require('../../lib/dvf/DVFError')
const BN = require('bignumber.js')

module.exports = async (dvf, token, starkKey) => {
  starkKey = dvf.config.starkExUseV2
    ? starkKey || dvf.config.starkKeyHex
    : '0x' + await dvf.contract.getStarkKey()

  if (!starkKey) {
    throw new Error('getWithdrawalBalance: starkKey is required')
  }

  const starkTokenId = dvf.config.tokenRegistry[token].starkTokenId
  const args = [starkKey, starkTokenId]

  try {
    return (withdrawalBalance = await dvf.eth.call(
      dvf.contract.abi.getStarkEx(),
      dvf.config.DVF.starkExContractAddress,
      'getWithdrawalBalance',
      args
    ))
  } catch (e) {
    console.log('contract/getStarkKey error is: ', e)
    throw new DVFError('ERR_GETTING_AVAILABLE_WITHDRAWAL')
  }
}
