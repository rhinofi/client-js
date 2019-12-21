const { post } = require('request-promise')
const sw = require('starkware_crypto')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (efx, token, amount, starkKeyPair) => {
  const assertionError = validateAssertions({efx, amount, token})
  if (assertionError) return assertionError

  const tempVaultId = 1
  const tokenId = efx.config.tokenRegistry[token].starkTokenId
  const vaultId = efx.config.tokenRegistry[token].starkVaultId

  var starkMessage = '',
    starkSignature = '',
    starkPublicKey = ''
  try {
    // const depositStatus = await efx.contract.deposit(tempVaultId, amount, userAddress);
    // console.log(`deposit contract call result: ${depositStatus}`, depositStatus)

    starkMessage = efx.stark.getTransferMsg(
      amount,
      '1', // nonce
      tempVaultId, // sender_vault_id
      tokenId, // token
      vaultId, // receiver_vault_id
      '0x1', // receiver_public_key
      (Math.floor(Date.now() / (1000 * 3600)) + efx.config.defaultExpiry) // expiration_timestamp
    ).starkMessage

    starkSignature = efx.stark.sign(starkKeyPair, starkMessage)
    starkPublicKey = sw.ec.keyFromPublic(starkKeyPair.getPublic(true, 'hex'), 'hex')
  } catch (e) {
    console.log(`error: ${e}`)
    // Error handling, user corrections
  }
  
  const url = efx.config.api + '/w/deposit'
  const data = {
    starkPublicKey,
    token,
    amount,
    starkSignature
  }

  return post(url, { json: data })
}
