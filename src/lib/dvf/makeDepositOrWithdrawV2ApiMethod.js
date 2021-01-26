const FP = require('lodash/fp')
const { Joi, Long, toQuantizedAmountBN, fromQuantizedToBaseUnitsBN } = require('dvf-utils')

const post = require('./post-authenticated')

const generateRandomNonceV2 = require('./generateRandomNonceV2')
const validateWithJoi = require('../validators/validateWithJoi')

const schema = Joi.object({
  token: Joi.string(),
  // This is base unit amount.
  amount: Joi.bigNumber().greaterThan(0),
  nonce: Joi.number().integer()
    .min(0)
    // Will be auto-generated if not provided.
    .optional()
})

module.exports = type => {
  if (!['deposit', 'withdrawal'].includes(type)) {
    throw new Error(`unexpected type ${type}`)
  }

  const validateArg0 = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
    context: `${type}V2`,
    argIdx: 0
  })

  const endpoint = `/v1/trading/${type}s`

  return (dvf, data, authNonce, signature) => {
    const validData = validateArg0(data)
    const { token, amount: baseUnitAmount } = validData

    const tokenInfo = dvf.token.getTokenInfoOrThrow(token)
    const quantisedAmount = toQuantizedAmountBN(tokenInfo, baseUnitAmount)

    if (quantisedAmount.isLessThan(1)) {
      throw new Error(
        `${type} amount too small, got: ${baseUnitAmount}, allowed minumum: ` +
        `${fromQuantizedToBaseUnitsBN(tokenInfo, 1)}`
      )
    }

    if (quantisedAmount.isGreaterThan(Long.MAX_VALUE)) {
      throw new Error(
        `${type} amount too large, got: ${baseUnitAmount} allowed minumum: ` +
        `${fromQuantizedToBaseUnitsBN(tokenInfo, Long.MAX_VALUE)}`
      )
    }

    const nonce = validData.nonce != null
      ? validData.nonce
      : generateRandomNonceV2()

    const payload = { token, amount: quantisedAmount, nonce }

    // Force the use of header (instead of payload) for authentication.
    dvf = FP.set('config.useAuthHeader', true, dvf)
    return post(dvf, endpoint, authNonce, signature, payload)
  }
}
