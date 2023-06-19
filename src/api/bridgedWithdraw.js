const FP = require('lodash/fp')
const { Joi } = require('@rhino.fi/dvf-utils')

const post = require('../lib/dvf/post-authenticated')

const generateRandomNonceV2 = require('../lib/dvf/generateRandomNonceV2')
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
  context: 'bridgedWithdrawal'
})

const endpoint = '/v1/trading/bridgedWithdrawals'

module.exports = async (dvf, data, authNonce, signature) => {
  const { chain, token, amount, nonce } = validateArg0(data)

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

  const payload = {
    chain,
    token,
    amount: quantisedAmount,
    tx,
    nonce: nonce || generateRandomNonceV2()
  }

  // Force the use of header (instead of payload) for authentication.
  dvf = FP.set('config.useAuthHeader', true, dvf)
  return post(dvf, endpoint, authNonce, signature, payload)
}
