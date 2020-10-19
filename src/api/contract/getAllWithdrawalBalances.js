const DVFError = require('../../lib/dvf/DVFError')
const BN = require('bignumber.js')

module.exports = async (dvf, starkTokenIds) => {
  const starkKey = dvf.config.starkExUseV2
    ? starkKey
    : '0x' + await dvf.contract.getStarkKey()

  if (!starkKey) {
    throw new Error('getWithdrawalBalance: starkKey is required')
  }

  const args = [starkTokenIds, starkKey]

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
