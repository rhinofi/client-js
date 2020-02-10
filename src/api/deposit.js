const { post } = require('request-promise')
const DVFError = require('../lib/dvf/DVFError')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, token, amount, starkPrivateKey) => {
  validateAssertions(dvf, { amount, token, starkPrivateKey })

  const currency = dvf.token.getTokenInfo(token)

  const quantisedAmount = dvf.token.toQuantizedAmount(token, amount)

  const tempVaultId = 1
  const nonce = '1'
  const starkTokenId = currency.starkTokenId
  let starkVaultId = currency.starkVaultId
  if (!starkVaultId) {
    starkVaultId = dvf.config.spareStarkVaultId
  }
  const { starkPublicKey, starkKeyPair } = dvf.stark.createRawStarkKeyPair(
    starkPrivateKey
  )

  // This should be in hours
  expireTime =
    Math.floor(Date.now() / (1000 * 3600)) + dvf.config.defaultStarkExpiry

  const { status, transactionHash } = await dvf.contract.deposit(
    tempVaultId,
    token,
    amount
  )

  if (!status) {
    throw new DVFError('ERR_ONCHAIN_DEPOSIT')
  }

  const { starkMessage } = dvf.stark.createTransferMsg(
    quantisedAmount,
    nonce, // nonce
    tempVaultId, // sender_vault_id
    starkTokenId, // token
    starkVaultId, // receiver_vault_id
    `0x${starkPublicKey.x}`, // receiver_public_key
    expireTime // expiration_timestamp
  )

  const starkSignature = dvf.stark.sign(starkKeyPair, starkMessage)
  //console.log({ starkMessage, starkSignature })

  const url = dvf.config.api + '/v1/trading/w/deposit'
  //const url = 'https://api.deversifi.dev' + '/v1/trading/w/deposit'

  const data = {
    token,
    amount,
    starkPublicKey,
    starkSignature,
    starkVaultId,
    expireTime,
    ethTxHash: transactionHash
  }
  //console.log({ data })
  return post(url, { json: data })
}
