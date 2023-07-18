const generateRandomNonceV2 = require('../lib/dvf/generateRandomNonceV2')
const { Joi } = require('dvf-utils')
const validateWithJoi = require('../lib/validators/validateWithJoi')
const getSafeQuantizedAmountOrThrow = require('../lib/dvf/token/getSafeQuantizedAmountOrThrow')
const getTokenAddressFromTokenInfoOrThrow = require('../lib/dvf/token/getTokenAddressFromTokenInfoOrThrow')

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
