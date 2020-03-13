const DVFError = require('../../lib/dvf/DVFError')
const BN = require('bignumber.js')

module.exports = async dvf => {
  const ethAddress = dvf.get('account')
  const args = [ethAddress]
  try {
    const starkKeyDecimal = await dvf.eth.call(
      dvf.contract.abi.StarkEx,
      dvf.config.DVF.starkExContractAddress,
      'getStarkKey',
      args
    )

    return new BN(starkKeyDecimal).toString(16)
  } catch (e) {
    console.log('contract/getStarkKey error is: ', e)
    throw new DVFError('ERR_GETTING_STARK_KEY')
  }
}
