const { Joi } = require('@rhino.fi/dvf-utils')
const get = require('../lib/dvf/get-authenticated')
const validateWithJoi = require('../lib/validators/validateWithJoi')

const schema = Joi.object({
  feature: Joi.string(),
  symbol: Joi.string()
})

const validateArg0 = validateWithJoi(schema, { presence: 'optional' })('INVALID_METHOD_ARGUMENT')({
  context: `getFeeRate`
})

const endpoint = '/v1/trading/r/feeRate'
/**
 *
 * Retrieve feeRate based on rhino.fi feeRate rules
 */
module.exports = async (dvf, data, nonce, signature) => {
  const { feature, symbol } = validateArg0(data || {})
  return get(dvf, endpoint, nonce, signature, { feature, symbol })
}
