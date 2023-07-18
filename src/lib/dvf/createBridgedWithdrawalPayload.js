const generateRandomNonceV2 = require('./generateRandomNonceV2')
const { Joi } = require('dvf-utils')
const validateWithJoi = require('../validators/validateWithJoi')
const getSafeQuantizedAmountOrThrow = require('./token/getSafeQuantizedAmountOrThrow')
const getTokenAddressFromTokenInfoOrThrow = require('./token/getTokenAddressFromTokenInfoOrThrow')

const schema = Joi.object({
  chain: Joi.string(),
  token: Joi.string(),
  amount: Joi.amount(),
  nonce: Joi.number().integer()
    .min(0)
    // Will be auto-generated if not provided.
    .optional()
})

const validateArg0 = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: `bridgedWithdrawal`
})

module.exports = async (dvf, data, authNonce, signature) => {
  const { token, chain, amount, nonce } = validateArg0(data)

  const tokenInfo = dvf.token.getTokenInfoOrThrow(token)
  // To make it fail if token is not supported
  getTokenAddressFromTokenInfoOrThrow(tokenInfo, chain)

  const quantisedAmount = getSafeQuantizedAmountOrThrow(amount, tokenInfo)
  const { vaultId, starkKey } = await dvf.getVaultIdAndStarkKey({
    token,
    targetEthAddress: dvf.config.DVF.deversifiAddress
  }, authNonce, signature)

  const { tx } = await dvf.createTransferPayload({
    token,
    amount,
    recipientPublicKey: starkKey,
    recipientVaultId: vaultId
  })

  return {
    chain,
    token,
    amount: quantisedAmount,
    tx,
    nonce: nonce || generateRandomNonceV2()
  }
}
