const { post } = require('request-promise')
const sw = require('starkware_crypto')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, starkKey, ethAddress) => {
  //TODO Add validation for starkKey and ethAddress in validateAssertions
  const assertionError = await validateAssertions({ dvf, starkKey, ethAddress })
  if (assertionError) return assertionError
  const onchainRegister = await dvf.contract.register(starkKey, ethAddress)
  if (onchainRegister && onchainRegister.error) {
    return onchainRegister
  }
  const url = dvf.config.api + '/w/register'
  const data = {
    starkKey,
    ethAddress
  }

  return post(url, { json: data })
}
