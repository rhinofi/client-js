const DVFError = require('../../lib/dvf/DVFError')
const BN = require('bignumber.js')

module.exports = async (dvf, starkTokenIds) => {
  const starkKey = await dvf.contract.getStarkKey()
  const args = [starkTokenIds, '0x' + starkKey]

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
