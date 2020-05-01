const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, starkPublicKey) => {
  validateAssertions(dvf, { starkPublicKey })

  const starkKey = starkPublicKey.x

  const nonce = Date.now() / 1000 + ''
  const signature = await dvf.sign(nonce.toString(16))

  const url = dvf.config.api + '/v1/trading/w/register'

  const data = {
    starkKey,
    nonce,
    signature
  }

  const userRegistered = await post(url, { json: data })

  if (userRegistered.isRegistered) {
    return userRegistered
  }

  if (userRegistered.deFiSignature) {
    const onchainRegister = await dvf.stark.register(
      dvf,
      starkKey,
      userRegistered.deFiSignature
    )

    if (onchainRegister) {
      return dvf.getUserConfig()
    }
  }
}
