const { post } = require('request-promise')
const sw = require('starkware_crypto')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, token, amount, starkKeyPair) => {
  const assertionError = await validateAssertions({ dvf, amount, token })
  if (assertionError) return assertionError

  const tempVaultId = 1
  const nonce = '1'
  const tokenId = dvf.config.tokenRegistry[token].starkTokenId
  const vaultId = dvf.config.tokenRegistry[token].starkVaultId

  const fullPublicKey = sw.ec.keyFromPublic(
    starkKeyPair.getPublic(true, 'hex'),
    'hex'
  )
  const starkPublicKey = {
    x: fullPublicKey.pub.getX().toString('hex'),
    y: fullPublicKey.pub.getY().toString('hex')
  }

  var starkMessage = '',
    starkSignature = '',
    expireTime =
      Math.floor(Date.now() / (1000 * 3600)) + dvf.config.defaultExpiry
  try {
    const depositStatus = true //await dvf.contract.deposit(tempVaultId, token, amount)
    console.log('deposit contract call result: ', depositStatus)

    starkMessage = dvf.stark.getTransferMsg(
      amount,
      nonce, // nonce
      tempVaultId, // sender_vault_id
      tokenId, // token
      vaultId, // receiver_vault_id
      `0x${starkPublicKey.x}`, // receiver_public_key
      expireTime // expiration_timestamp
    ).starkMessage

    starkSignature = dvf.stark.sign(starkKeyPair, starkMessage)
    console.log({ starkMessage, starkSignature })
  } catch (e) {
    console.log(`error: ${e.message}`)
    // Error handling, user corrections
  }

  const url = dvf.config.api + '/w/deposit'
  const data = {
    starkPublicKey,
    token,
    amount,
    starkSignature
  }

  return post(url, { json: data })
}
