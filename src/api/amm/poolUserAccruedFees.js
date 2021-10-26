const { Joi } = require('dvf-utils')
const getAuthenticated = require('../../lib/dvf/get-authenticated')
const validateWithJoi = require('../../lib/validators/validateWithJoi')

const schema = Joi.object({
  poolName: Joi.string()
})

const validateInputs = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'poolUserAccruedFees'
})

module.exports = async (dvf, data, nonce, signature) => {
  const { poolName } = validateInputs(data)
  const endpoint = `/v1/trading/amm/poolUserAccruedFees/${poolName}`
  return getAuthenticated(dvf, endpoint, nonce, signature)
}
