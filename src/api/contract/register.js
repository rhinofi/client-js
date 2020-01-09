const reasons = require('../../lib/error/reasons')
const BN = require('bignumber.js')

module.exports = async (dvf, starkKey, ethAddress) => {
  const { web3 } = dvf
  const starkInstance = new web3.eth.Contract(
    dvf.contract.abi.StarkEx,
    dvf.config.DVF.starkExContractAddress
  )

  const sendArguments = {
    from: ethAddress,
    gasLimit: 200000,
    gasPrice: 14000000000
  }

  let onchainResult = ''
  try {
    onchainResult = await starkInstance.methods
      .register(`0x${starkKey}`)
      .send(sendArguments)
  } catch (e) {
    console.log('contract/stark/register error is: ', e)
    return {
      error: 'ERR_STARK_REGISTRATION',
      reason: reasons.ERR_STARK_REGISTRATION.trim()
    }
  }

  if (onchainResult || onchainResult.status === true)
    try {
      const fromStark = await starkInstance.methods
        .getStarkKey(ethAddress)
        .call()

      const fromStarkHex = new BN(fromStark).toString(16)

      console.log(
        'key retrieved registered with stark: ',
        fromStark,
        fromStarkHex
      )
      if (fromStarkHex === starkKey) {
        return true
      } else
        return {
          error: 'ERR_STARK_REGISTRATION_MISMATCH',
          reason: reasons.ERR_STARK_REGISTRATION_MISMATCH.trim()
        }
    } catch (e) {
      console.log('contract/stark/getStarkKey error is: ', e)
      return {
        error: 'ERR_STARK_REGISTRATION_CONFIRMATION',
        reason: reasons.ERR_STARK_REGISTRATION_CONFIRMATION.trim()
      }
    }
}
