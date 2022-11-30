const { Joi } = require('@rhino.fi/dvf-utils')
const getAuthenticated = require('../../lib/dvf/get-authenticated')
const validateWithJoi = require('../../lib/validators/validateWithJoi')

const schema = Joi.object({
  pools: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string()))
})

const validateInputs = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'poolsUserData'
})

module.exports = async (dvf, data, nonce, signature) => {
  const { pools } = validateInputs(data)
  const endpoint = '/v1/trading/amm/poolsUserData'
  return getAuthenticated(dvf, endpoint, nonce, signature, { pools })
}
