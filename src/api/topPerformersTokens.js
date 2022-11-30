const { Joi } = require('@rhino.fi/dvf-utils')
const get = require('../lib/dvf/get-generic')
const validateWithJoi = require('../lib/validators/validateWithJoi')

const schema = Joi.object({
  count: Joi.number(),
  minMarketCap: Joi.number().optional()
})

const validateInputs = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'topPerformersTokensQuery'
})
module.exports = async (dvf, data) => {
  const { count, minMarketCap } = validateInputs(data)
  const endpoint = '/v1/trading/r/topPerformersTokens'
  return get(dvf, endpoint, { count, minMarketCap })
}
