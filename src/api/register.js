const post = require('../lib/dvf/post-authenticated')
const DVFError = require('../lib/dvf/DVFError')

const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, starkPublicKey, nonce, signature, contractWalletAddress, encryptedTradingKey, meta) => {
  validateAssertions(dvf, {starkPublicKey})

  const tradingKey = starkPublicKey.x

  const endpoint = '/v1/trading/w/register'

  const data = {
    starkKey: tradingKey,
    nonce,
    signature,
    ...(encryptedTradingKey && {encryptedTradingKey}),
    ...(contractWalletAddress && {contractWalletAddress}),
    ...(meta && {meta})
  }

  const userRegistered = await post(dvf, endpoint, nonce, signature, data)

  if (userRegistered.isRegistered || dvf.config.DVF.starkExVersion === '4') {
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
      if (
        error.code === 4001 &&
        error.message === 'MetaMask Tx Signature: User denied transaction signature.'
      ) {
        throw new DVFError('ERR_USER_DENIED_TX', {error})
      }
      throw new DVFError('ERR_STARK_REGISTRATION', {error})
    }

    if (onChainRegister) {
      return dvf.getUserConfig(nonce, signature)
    }
  }
}
