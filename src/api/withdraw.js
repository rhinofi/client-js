const { post } = require('request-promise')
const DVFError = require('../lib/dvf/DVFError')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, token, amount, starkPrivateKey) => {
  validateAssertions(dvf, { amount, token, starkPrivateKey })

  const currency = dvf.token.getTokenInfo(token)

  const quantisedAmount = dvf.token.toQuantizedAmount(token, amount)

  const tempVaultId = dvf.config.DVF.tempStarkVaultId
  const nonce = dvf.util.generateRandomNonce()
  const starkTokenId = currency.starkTokenId
  let starkVaultId = currency.starkVaultId

  const { starkPublicKey, starkKeyPair } = await dvf.stark.createKeyPair(
    starkPrivateKey
  )

  // This should be in hours
  expireTime =
    Math.floor(Date.now() / (1000 * 3600)) +
    parseInt(dvf.config.defaultStarkExpiry)

  const { starkMessage } = dvf.stark.createTransferMsg(
    quantisedAmount,
    nonce,
    starkVaultId,
    starkTokenId,
    tempVaultId,
    `0x${starkPublicKey.x}`,
    expireTime
  )

  const starkSignature = dvf.stark.sign(starkKeyPair, starkMessage)

  const url = dvf.config.api + '/v1/trading/w/withdraw'

  const data = {
    token,
    amount,
    nonce,
    starkPublicKey,
    starkSignature,
    starkVaultId,
    expireTime
  }
  //console.log({ data })
  return post(url, { json: data })
}
