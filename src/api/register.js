const post = require('../lib/dvf/post-authenticated')
const DVFError = require('../../lib/dvf/DVFError')

const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, starkPublicKey, nonce, signature, contractWalletAddress, encryptedTradingKey) => {
  validateAssertions(dvf, {starkPublicKey})

  const tradingKey = starkPublicKey.x

  const endpoint = '/v1/trading/w/register'

  const data = {
    starkKey: tradingKey,
    nonce,
    signature,
    ...(encryptedTradingKey && {encryptedTradingKey}),
    ...(contractWalletAddress && {contractWalletAddress})
  }

  const userRegistered = await post(dvf, endpoint, nonce, signature, data)

  if (userRegistered.isRegistered) {
    return userRegistered
  }

  if (userRegistered.deFiSignature) {
    let onChainRegister
    try {
      onChainRegister = await dvf.stark.register(
        dvf,
        tradingKey,
        userRegistered.deFiSignature
      )
    } catch (error) {
      throw new DVFError('ERR_STARK_REGISTRATION', {error})
    }

    if (onChainRegister) {
      return dvf.getUserConfig(nonce, signature)
    }
  }
}
