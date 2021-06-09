const {
  Joi,
  toQuantizedAmountBN
} = require('dvf-utils')
const validateWithJoi = require('../validators/validateWithJoi')
const DVFError = require('./DVFError')
const makeCreateSignedTransferTx = require('./makeCreateSignedTransferTx')

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

const transferDataSchema = Joi.object({
  amount: Joi.amount(),
  // NOTE: we are not specifying allowed tokens here since these can change
  // dynamically. However a call to `getTokenInfoOrThrow` will ensure that
  // the token in valid.
  memo: Joi.string().optional(),
  token: Joi.string(),
  recipientPublicKey: Joi.prefixedHexString(),
  recipientVaultId: Joi.number().integer()
})

const feeRecipientSchema = Joi.object({
  starkKey: Joi.prefixedHexString(),
  vaultId: Joi.number().integer()
})

const errorProps = {context: 'transferUsingVaultIdAndStarkKey'}
const validateArg0 = validateWithJoi(transferDataSchema)('INVALID_METHOD_ARGUMENT')({
  ...errorProps, argIdx: 0
})

const validateArg1 = validateWithJoi(feeRecipientSchema)('INVALID_METHOD_ARGUMENT')({
  ...errorProps, argIdx: 1
})

module.exports = async (dvf, transferData, feesRecipient, createSignedTransferTx = makeCreateSignedTransferTx(dvf)) => {
  const {
    amount,
    token,
    recipientPublicKey,
    recipientVaultId,
    memo
  } = validateArg0(transferData)

  const tokenInfo = getValidTokenInfo(dvf)(token)
  const quantisedAmount = toQuantizedAmountBN(tokenInfo, amount)

  // tokenInfo.transferFee from conf as fee switch
  if (!tokenInfo.transferFee || !feesRecipient) {
    console.warn('No fees set for token or not recipient. Skipping fee tx', token, feesRecipient)
    return createSignedTransferTx({
      recipientPublicKey,
      recipientVaultId,
      tokenInfo,
      quantisedAmount
    })
  }

  // Fees are handled by deducting from the requested amount
  // Two distinct txs are created : tx and feeTx with amount defined in conf
  // On the server side, the two txs are processed atomically and
  // fee amount and recipient are checked against current configuration
  const {
    starkKey: feeStarkKey,
    vaultId: feeVaultId
  } = validateArg1(feesRecipient)

  const feeAmount = toQuantizedAmountBN(tokenInfo, tokenInfo.transferFee)
  // Sign fees tx
  const { tx: feeTx } = await createSignedTransferTx({
    recipientPublicKey: feeStarkKey,
    recipientVaultId: feeVaultId,
    tokenInfo,
    quantisedAmount: feeAmount
  })

  // Sign main tx
  const { starkPublicKey, tx } = await createSignedTransferTx({
    recipientPublicKey,
    recipientVaultId,
    tokenInfo,
    quantisedAmount: quantisedAmount.minus(feeAmount)
  })

  return { tx, feeTx, starkPublicKey, memo }
}
