const DVFError = require('../../lib/dvf/DVFError')
const BN = require('bignumber.js')

module.exports = async (dvf, token, address) => {
  address = address || dvf.get('account')

  if (!address) {
    throw new Error('getWithdrawalBalanceEthAddress: address is required')
  }

  const starkTokenId = dvf.config.tokenRegistry[token].starkTokenId

  if (!starkTokenId) {
    throw new Error(`getWithdrawalBalanceEthAddress: no starkTokenId for token: ${token}`)
  }

  const args = [address, starkTokenId]

  try {
    return (await dvf.eth.call(
      dvf.contract.abi.getStarkEx(),
      dvf.config.DVF.starkExContractAddress,
      'getWithdrawalBalance',
      args
    ))
  } catch (e) {
    console.log('contract/getWithdrawalBalance error is: ', e)
    throw new DVFError('ERR_GETTING_AVAILABLE_WITHDRAWAL')
  }
}
