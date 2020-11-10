const DVFError = require('../../lib/dvf/DVFError')
const BN = require('bignumber.js')

module.exports = async (dvf, starkTokenIds, tradingKey) => {
  tradingKey = dvf.config.starkExUseV2
    ? tradingKey || dvf.config.starkKeyHex
    : '0x' + await dvf.contract.getStarkKey()

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
