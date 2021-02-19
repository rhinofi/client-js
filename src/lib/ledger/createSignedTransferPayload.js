const {
  Joi,
  toQuantizedAmountBN
} = require('dvf-utils')
const validateWithJoi = require('../validators/validateWithJoi')
const DVFError = require('../dvf/DVFError')

const getValidTokenInfo = dvf => token => {
  const tokenInfo = dvf.token.getTokenInfoOrThrow(token)

  if (!tokenInfo.starkVaultId) {
    throw new DVFError(
      'NO_STARK_VAULT_ID_FOR_TOKEN',
      {token, context: 'createTransferPayload'}
    )
  }

  return tokenInfo
}

const schema = Joi.object({
  amount: Joi.amount(),
  // NOTE: we are not specifying allowed tokens here since these can change
  // dynamically. However a call to `getTokenInfoOrThrow` will ensure that
  // the token in valid.
  token: Joi.string(),
  recipientPublicKey: Joi.prefixedHexString(),
  recipientVaultId: Joi.number().integer()
})

const errorProps = {context: 'transferUsingVaultIdAndStarkKey'}
const validateArg0 = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  ...errorProps, argIdx: 0
})

module.exports = dvf => async (transferData, path) => {
  const {
    amount,
    token,
    recipientPublicKey,
    recipientVaultId
  } = validateArg0(transferData)

  const starkPublicKey = await dvf.stark.ledger.getPublicKey(path)
  const tokenInfo = getValidTokenInfo(dvf)(token)
  const quantisedAmount = toQuantizedAmountBN(tokenInfo, amount)

  const tx = {
    amount: quantisedAmount.toString(),
    receiverPublicKey: recipientPublicKey,
    receiverVaultId: recipientVaultId,
    senderVaultId: tokenInfo.starkVaultId,
    token: tokenInfo.starkTokenId,
    type: 'TransferRequest'
  }

  const {starkSignature, nonce, expireTime} = await dvf.stark.ledger.createSignedTransfer(
    path,
    tx.token,
    tx.amount,
    tx.senderVaultId,
    tx.receiverVaultId
  )

  return {
    tx: {
      ...tx,
      signature: starkSignature,
      nonce,
      expirationTimestamp: expireTime
    },
    starkPublicKey
  }
}
