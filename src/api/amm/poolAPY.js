const { Joi } = require('dvf-utils')
const get = require('../../lib/dvf/get-generic')
const validateWithJoi = require('../../lib/validators/validateWithJoi')

const schema = Joi.object({
  pool: Joi.string()
})

const validateInputs = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'poolAPY'
})

module.exports = async (dvf, data) => {
  const { pool } = validateInputs(data)
  const endpoint = `/v2/trading/amm/poolAPY/${pool}`
  return {
    pool,
    liquidityMiningAPY: 0.003,
    effectiveAPY: 0.01746546
  }
  // return get(dvf, endpoint)
}
