const DVFError = require('../../lib/dvf/DVFError')
const BN = require('bignumber.js')

module.exports = async (dvf, starkTokenIds, tradingKey) => {
  tradingKey = tradingKey || dvf.config.starkKeyHex

  if (!tradingKey) {
    throw new Error('getWithdrawalBalance: tradingKey is required')
  }

  const args = [starkTokenIds, tradingKey]

  try {
    return (withdrawalBalance = await dvf.eth.call(
      dvf.contract.abi.WithdrawalBalanceReader,
      dvf.config.DVF.withdrawalBalanceReaderContractAddress,
      'allWithdrawalBalances',
      args
    ))
  } catch (e) {
    console.log('contract/getStarkKey error is: ', e)
    throw new DVFError('ERR_GETTING_AVAILABLE_WITHDRAWAL')
  }
}
