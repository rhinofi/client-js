const { Joi } = require('@rhino.fi/dvf-utils')
const validateWithJoi = require('../lib/validators/validateWithJoi')

const schema = Joi.object({
  token: Joi.string(),
  amount: Joi.string(),
  chain: Joi.string(),
  type: Joi.string(),
  recipient: Joi.string().optional(),
  abortSignal: Joi.any().optional()
})

const validateInputs = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'getWithdrawalQuote'
})

module.exports = async (dvf, data, nonce, signature) => {
  const { get } = dvf.request
  const { abortSignal, ...requestData } = validateInputs(data)

  return get('/v1/trading/withdrawalQuotes', nonce, signature, {
    data: requestData,
    signal: abortSignal
  })
}
