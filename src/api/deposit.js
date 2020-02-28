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
  if (!starkVaultId) {
    starkVaultId = dvf.config.spareStarkVaultId
  }
  const { starkPublicKey, starkKeyPair } = await dvf.stark.createKeyPair(
    starkPrivateKey
  )

  // This should be in hours
  expireTime =
    Math.floor(Date.now() / (1000 * 3600)) +
    parseInt(dvf.config.defaultStarkExpiry)

  const { status, transactionHash } = await dvf.contract.deposit(
    tempVaultId,
    token,
    amount
  )

  // used for testing without making onchain contract call
  // const { status, transactionHash } = { status: true, transactionHash: '0xabc' }

  if (!status) {
    throw new DVFError('ERR_ONCHAIN_DEPOSIT')
  }

  const { starkMessage } = dvf.stark.createTransferMsg(
    quantisedAmount,
    nonce,
    tempVaultId,
    starkTokenId,
    starkVaultId,
    `0x${starkPublicKey.x}`,
    expireTime
  )

  const starkSignature = dvf.stark.sign(starkKeyPair, starkMessage)

  const url = dvf.config.api + '/v1/trading/w/deposit'

  const data = {
    token,
    amount,
    nonce,
    starkPublicKey,
    starkSignature,
    starkVaultId,
    expireTime,
    ethTxHash: transactionHash
  }
  //console.log({ data })

  const depositResponse = await post(url, { json: data })

  await dvf.getUserConfig()

  return depositResponse
}
