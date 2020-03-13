const DVFError = require('../../lib/dvf/DVFError')
const BN = require('bignumber.js')

module.exports = async (dvf, token) => {
  const starkKey = await dvf.contract.getStarkKey()
  const starkTokenId = dvf.config.tokenRegistry[token].starkTokenId
  const args = ['0x' + starkKey, starkTokenId]

  try {
    return (withdrawalBalance = await dvf.eth.call(
      dvf.contract.abi.StarkEx,
      dvf.config.DVF.starkExContractAddress,
      'getWithdrawalBalance',
      args
    ))
  } catch (e) {
    console.log('contract/getStarkKey error is: ', e)
    throw new DVFError('ERR_GETTING_AVAILABLE_WITHDRAWAL')
  }
}
