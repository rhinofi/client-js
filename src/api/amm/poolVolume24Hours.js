const { Joi } = require('dvf-utils')
const get = require('../../lib/dvf/get-generic')
const validateWithJoi = require('../../lib/validators/validateWithJoi')

const schema = Joi.object({
  pool: Joi.string()
})

const validateInputs = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'poolVolume24Hours'
})

module.exports = async (dvf, data) => {
  const { pool } = validateInputs(data)
  const endpoint = `/v1/trading/amm/poolVolume24Hours/${pool}`
  return get(dvf, endpoint)
}
