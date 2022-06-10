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

  return userRegistered
}
