const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, starkPublicKey) => {
  validateAssertions(dvf, { starkPublicKey })

  const ethAddress = dvf.get('account')
  const starkKey = starkPublicKey.x
  let url = dvf.config.api + '/v1/trading/w/preRegister'
  let data = {
    starkKey,
    ethAddress
  }

  const { deFiSignature } = await post(url, { json: data })

  const onchainRegister = await dvf.stark.register(dvf, starkKey, deFiSignature)

  // console.log('onchain register contract call result: ', onchainRegister)
  if (onchainRegister.error) {
    return onchainRegister
  }

  const nonce = Date.now() / 1000 + ''
  const signature = await dvf.sign(nonce.toString(16))

  url = dvf.config.api + '/v1/trading/w/register'

  data = {
    starkKey,
    nonce,
    signature
  }

  return post(url, { json: data })
}
