const DVFError = require('../../lib/dvf/DVFError')
const BN = require('bignumber.js')

module.exports = async (dvf, token, tradingKey) => {
  tradingKey = dvf.config.starkExUseV2
    ? tradingKey || dvf.config.starkKeyHex
    : '0x' + await dvf.contract.getStarkKey()

  if (!tradingKey) {
    throw new Error('getWithdrawalBalance: tradingKey is required')
  }

  const starkTokenId = dvf.config.tokenRegistry[token].starkTokenId
  const args = [tradingKey, starkTokenId]

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
