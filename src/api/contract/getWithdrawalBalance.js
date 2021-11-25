const DVFError = require('../../lib/dvf/DVFError')
const BN = require('bignumber.js')

module.exports = async (dvf, token, tradingKey) => {
  tradingKey = tradingKey || dvf.config.starkKeyHex

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
