const DVFError = require('../../lib/dvf/DVFError')

module.exports = async (dvf, tradingKey, deFiSignature, ethAddress) => {
  ethAddress = ethAddress || dvf.get('account')

  const action = 'registerUser'

  const args = [ethAddress, `0x${tradingKey}`, deFiSignature]

  try {
    await dvf.eth.send(
      dvf.contract.abi.getStarkEx(),
      dvf.config.DVF.starkExContractAddress,
      action,
      args
    )
  } catch (error) {
    console.log('api/contract/register error is: ', error)
    throw new DVFError('ERR_STARK_REGISTRATION', {error})
  }

  return true
}
