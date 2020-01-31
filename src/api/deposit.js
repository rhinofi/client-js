const { post } = require('request-promise')
const BigNumber = require('bignumber.js')
const reasons = require('../lib/error/reasons')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, token, amount, starkPrivateKey) => {
  const assertionError = await validateAssertions({
    dvf,
    amount,
    token,
    starkPrivateKey
  })

  if (assertionError) return assertionError

  const currency = dvf.token.getTokenInfo(token)

  const quantisedAmount = new BigNumber(10)
    .pow(currency.decimals)
    .times(amount)
    .integerValue(BigNumber.ROUND_FLOOR)
    .toString()

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

  var starkMessage = '',
    starkSignature = '',
    // This should be in hours
    expireTime =
      Math.floor(Date.now() / (1000 * 3600)) + dvf.config.defaultStarkExpiry
  try {
    const depositStatus = true //await dvf.contract.deposit(tempVaultId, token, amount)
    console.log('onchain deposit contract call result: ', depositStatus)

    starkMessage = dvf.stark.createTransferMsg(
      quantisedAmount,
      nonce, // nonce
      tempVaultId, // sender_vault_id
      starkTokenId, // token
      starkVaultId, // receiver_vault_id
      `0x${starkPublicKey.x}`, // receiver_public_key
      expireTime // expiration_timestamp
    ).starkMessage

    starkSignature = dvf.stark.sign(starkKeyPair, starkMessage)
    //console.log({ starkMessage, starkSignature })
  } catch (e) {
    return {
      error: 'ERR_ONCHAIN_DEPOSIT',
      reason: reasons.ERR_ONCHAIN_DEPOSIT.trim(),
      originalError: e
    }
  }

  const url = dvf.config.api + '/v1/trading/w/deposit'
  const data = {
    token,
    amount,
    starkPublicKey,
    starkSignature,
    starkVaultId,
    expireTime
  }

  return post(url, { json: data })
}
