const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, starkKey, ethAddress) => {
  console.log(dvf.config.DVF.starkExContractAddress, starkKey, ethAddress)
  const assertionError = await validateAssertions({ dvf, starkKey, ethAddress })
  if (assertionError) return assertionError

  const onchainRegister = true //await dvf.stark.register(dvf, starkKey, ethAddress)
  console.log({ onchainRegister })
  if (onchainRegister && onchainRegister.error) {
    return onchainRegister
  }

  const nonce = Date.now() / 1000 + 30 + ''
  const signature = await dvf.sign(nonce.toString(16))
  const url = dvf.config.api + '/w/register'
  const data = {
    starkKey,
    nonce,
    signature
  }

  return post(url, { json: data })
}
