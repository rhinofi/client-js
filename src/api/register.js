const post = require('../lib/dvf/post-authenticated')

const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, starkPublicKey, nonce, signature, walletType) => {
  validateAssertions(dvf, { starkPublicKey })

  const starkKey = starkPublicKey.x

  const endpoint = '/v1/trading/w/register'

  const data = {
    starkKey,
    nonce,
    signature, 
    walletType
  }

  const userRegistered = await post(dvf, endpoint, nonce, signature, data)

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
      return dvf.getUserConfig(nonce, signature)
    }
  }
}
