const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, starkKey, deFiSignature) => {
  const assertionError = await validateAssertions({
    dvf,
    starkKey,
    deFiSignature
  })
  if (assertionError) return assertionError

  const onchainRegister = true //await dvf.stark.newRegister(
  //   dvf,
  //   starkKey,
  //   deFiSignature
  // )
  console.log({ onchainRegister })
  if (onchainRegister && onchainRegister.error) {
    return onchainRegister
  }

  const nonce = Date.now() / 1000 + 30 + ''
  const signature = await dvf.sign(nonce.toString(16))
  const url = dvf.config.api + '/w/newRegister'
  const data = {
    starkKey,
    nonce,
    signature
  }
  return post(url, { json: data })
}
