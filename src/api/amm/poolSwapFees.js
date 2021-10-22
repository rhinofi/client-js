const { Joi } = require('dvf-utils')
const get = require('../../lib/dvf/get-generic')
const validateWithJoi = require('../../lib/validators/validateWithJoi')

const schema = Joi.object({
  pool: Joi.string()
})

const validateInputs = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'poolSwapFees'
})

module.exports = async (dvf, data) => {
  const { pool } = validateInputs(data)
  const endpoint = `/v2/trading/amm/poolSwapFees/${pool}`
  return {
    pool,
    swapFees: 0.002
  }
  // return get(dvf, endpoint)
}
