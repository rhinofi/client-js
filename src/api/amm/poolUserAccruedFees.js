const { Joi } = require('dvf-utils')
const getAuthenticated = require('../../lib/dvf/get-authenticated')
const validateWithJoi = require('../../lib/validators/validateWithJoi')

const schema = Joi.object({
  pool: Joi.string()
})

const validateInputs = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'poolUserLpBalance'
})

module.exports = async (dvf, data, nonce, signature) => {
  const { pool } = validateInputs(data)
  const endpoint = `/v1/trading/amm/poolUserAccruedFees/${pool}`
  return getAuthenticated(dvf, endpoint, nonce, signature)
}
