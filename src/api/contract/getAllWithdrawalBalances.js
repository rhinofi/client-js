const DVFError = require('../../lib/dvf/DVFError')

module.exports = async (dvf, starkTokenIds, tradingKey) => {
  tradingKey = tradingKey || dvf.config.starkKeyHex

  if (!tradingKey) {
    throw new Error('getWithdrawalBalance: tradingKey is required')
  }

  const args = [starkTokenIds, tradingKey]

  try {
    return (withdrawalBalance = await dvf.eth.call(
      dvf.contract.abi.WithdrawalBalanceReader,
      dvf.config.DVF.registrationAndDepositInterfaceAddress,
      'allWithdrawalBalances',
      args,
      { chain: 'ETHEREUM' }
    ))
  } catch (e) {
    console.warn('contract/getAllWithdrawalBalances error is: ', e)
    throw new DVFError('ERR_GETTING_AVAILABLE_WITHDRAWAL')
  }
}
