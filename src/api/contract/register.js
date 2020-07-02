const DVFError = require('../../lib/dvf/DVFError')
const BN = require('bignumber.js')

module.exports = async (dvf, starkKey, deFiSignature, txMeta) => {
  const ethAddress = dvf.get('account')
  const { web3 } = dvf
  const starkInstance = new web3.eth.Contract(
    dvf.contract.abi.StarkEx,
    dvf.config.DVF.starkExContractAddress
  )

  let onchainResult = ''
  const action = 'register'
  const args = [`0x${starkKey}`, deFiSignature]
  try {
    onchainResult = await dvf.eth.send(
      dvf.contract.abi.StarkEx,
      dvf.config.DVF.starkExContractAddress,
      action,
      args,
      null,
      txMeta
    )
  } catch (e) {
    console.log('api/contract/register error is: ', e)
    throw new DVFError('ERR_STARK_REGISTRATION')
  }

  if (onchainResult || onchainResult.status === true) {
    try {
      const fromStark = await starkInstance.methods
        .getStarkKey(ethAddress)
        .call()

      if (new BN(fromStark).eq(new BN(starkKey, 16))) {
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
