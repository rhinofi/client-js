const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, starkPublicKey, deFiSignature) => {
  validateAssertions(dvf, { starkPublicKey, deFiSignature })

  const starkKey = starkPublicKey.x
  const onchainRegister = await dvf.stark.register(dvf, starkKey, deFiSignature)

  //console.log('onchain register contract call result: ', onchainRegister)
  if (onchainRegister.error) {
    return onchainRegister
  }

  const nonce = Date.now() / 1000 + ''
  const signature = await dvf.sign(nonce.toString(16))
  const url = dvf.config.api + '/v1/trading/w/register'

  const data = {
    starkKey: tradingKey,
    nonce,
    signature
  }

  const registerResponse = await post(url, { json: data })

  await dvf.getUserConfig()

  return registerResponse
}
