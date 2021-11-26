const DVFError = require('../../lib/dvf/DVFError')

module.exports = async (dvf, starkTokenIds, address) => {
  address = address || dvf.get('account')

  if (!address) {
    throw new Error('getWithdrawalBalanceEthAddress: address is required')
  }

  const args = [starkTokenIds, address]

  try {
    return (withdrawalBalance = await dvf.eth.call(
      dvf.contract.abi.WithdrawalBalanceReader,
      dvf.config.DVF.registrationAndDepositInterfaceAddress,
      'allWithdrawalBalances',
      args,
      { chain: 'ETHEREUM' }
    ))
  } catch (e) {
    console.warn('contract/getAllWithdrawalBalancesEthAddress error is: ', e)
    throw new DVFError('ERR_GETTING_AVAILABLE_WITHDRAWAL')
  }
}
