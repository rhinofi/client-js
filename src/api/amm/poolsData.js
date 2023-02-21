const { Joi } = require('@rhino.fi/dvf-utils')
const get = require('../../lib/dvf/get-generic')
const validateWithJoi = require('../../lib/validators/validateWithJoi')

const schema = Joi.object({
  pools: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string()))
})

const validateInputs = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'poolsData'
})

module.exports = async (dvf, data) => {
  const { pools } = validateInputs(data)
  const endpoint = '/v1/trading/amm/poolsData'
  return get(dvf, endpoint, { pools })
}
