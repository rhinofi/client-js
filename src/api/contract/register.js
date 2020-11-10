const DVFError = require('../../lib/dvf/DVFError')
const BN = require('bignumber.js')

module.exports = async (dvf, tradingKey, deFiSignature, ethAddress) => {
  ethAddress = ethAddress || dvf.get('account')

  const { web3 } = dvf
  const starkInstance = new web3.eth.Contract(
    dvf.contract.abi.getStarkEx(),
    dvf.config.DVF.starkExContractAddress
  )

  let onchainResult = ''
  const action = dvf.config.starkExUseV2
    ? 'registerUser'
    : 'register'

  const args = [`0x${tradingKey}`, deFiSignature]

  if (dvf.config.starkExUseV2) {
    args.unshift(ethAddress)
  }

  try {
    onchainResult = await dvf.eth.send(
      dvf.contract.abi.getStarkEx(),
      dvf.config.DVF.starkExContractAddress,
      action,
      args
    )
  } catch (e) {
    console.log('api/contract/register error is: ', e)
    throw new DVFError('ERR_STARK_REGISTRATION')
  }

  if (dvf.config.starkExUseV2) {
    // TODO: StarkExV2: do we need to do any extra validation here?
    return true
  }

  if (onchainResult || onchainResult.status === true) {
    try {
      const fromStark = await starkInstance.methods
        .getStarkKey(ethAddress)
        .call()

      if (new BN(fromStark).eq(new BN(tradingKey, 16))) {
        return true
      } else {
        throw new DVFError('ERR_STARK_REGISTRATION_MISMATCH')
      }
    } catch (e) {
      console.log('contract/stark/getStarkKey error is: ', e)
      throw new DVFError('ERR_STARK_REGISTRATION_CONFIRMATION')
    }
  }
}
