const { Joi } = require('dvf-utils')
const validateWithJoi = require('../validators/validateWithJoi')
const DVFError = require('./DVFError')
const makeCreateSignedTransferTx = require('./makeCreateSignedTransferTx')
const getSafeQuantizedAmountOrThrow = require('./token/getSafeQuantizedAmountOrThrow')

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
  token: Joi.string(),
  recipientPublicKey: Joi.ethAddress(),
  recipientVaultId: Joi.number().integer()
})

const errorProps = {context: 'transferAndWithdrawPayload'}
const validateArg0 = validateWithJoi(transferDataSchema)('INVALID_METHOD_ARGUMENT')({
  ...errorProps, argIdx: 0
})

module.exports = async (dvf, transferData, createSignedTransferTx = makeCreateSignedTransferTx(dvf)) => {
  const {
    amount,
    token,
    recipientPublicKey,
    recipientVaultId
  } = validateArg0(transferData)

  const tokenInfo = getValidTokenInfo(dvf)(token)
  const quantisedAmount = getSafeQuantizedAmountOrThrow(amount, tokenInfo)

  const { tx } = await createSignedTransferTx({
    recipientPublicKey,
    recipientVaultId,
    tokenInfo,
    quantisedAmount
  })

  return { tx }
}
