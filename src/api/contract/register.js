const DVFError = require('../../lib/dvf/DVFError')
const BN = require('bignumber.js')

module.exports = async (dvf, tradingKey, deFiSignature, ethAddress) => {
  ethAddress = ethAddress || dvf.get('account')

  const { web3 } = dvf
  const starkInstance = new web3.eth.Contract(
    dvf.contract.abi.getStarkEx(),
    dvf.config.DVF.starkExContractAddress
  )

  const action = 'registerUser'

  const args = [ethAddress, `0x${tradingKey}`, deFiSignature]

  try {
    await dvf.eth.send(
      dvf.contract.abi.getStarkEx(),
      dvf.config.DVF.starkExContractAddress,
      action,
      args
    )
  } catch (e) {
    console.log('api/contract/register error is: ', e)
    throw new DVFError('ERR_STARK_REGISTRATION')
  }

  return true
}
