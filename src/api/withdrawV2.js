const FP = require('lodash/fp')
const { Joi } = require('@rhino.fi/dvf-utils')

const post = require('../lib/dvf/post-authenticated')

const generateRandomNonceV2 = require('../lib/dvf/generateRandomNonceV2')
const validateWithJoi = require('../lib/validators/validateWithJoi')
const getSafeQuantizedAmountOrThrow = require('../lib/dvf/token/getSafeQuantizedAmountOrThrow')

const schema = Joi.object({
  token: Joi.string(),
  amount: Joi.bigNumber().greaterThan(0), // number or number string
  nonce: Joi.number().integer()
    .min(0)
    // Will be auto-generated if not provided.
    .optional()
})

const validateArg0 = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: `withdrawV2`
})

const endpoint = '/v1/trading/withdrawals'

module.exports = async (dvf, data, authNonce, signature) => {
  const { token, amount, nonce } = validateArg0(data)

  const tokenInfo = dvf.token.getTokenInfoOrThrow(token)
  const quantisedAmount = getSafeQuantizedAmountOrThrow(amount, tokenInfo)

  const payload = {
    token,
    amount: quantisedAmount,
    nonce: nonce || generateRandomNonceV2()
  }

  // Force the use of header (instead of payload) for authentication.
  dvf = FP.set('config.useAuthHeader', true, dvf)
  return post(dvf, endpoint, authNonce, signature, payload)
}
