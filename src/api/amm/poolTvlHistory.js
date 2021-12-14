const { Joi } = require('dvf-utils')
const get = require('../../lib/dvf/get-generic')
const validateWithJoi = require('../../lib/validators/validateWithJoi')

const schema = Joi.object({
  poolName: Joi.string(),
  duration: Joi.string().valid('1d', '1w', '1m', '1y')
})

const validateInputs = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'poolTvlHistory'
})

module.exports = async (dvf, data) => {
  const { poolName, duration } = validateInputs(data)
  const endpoint = `/v1/trading/amm/poolTvlHistory/${poolName}?duration=${duration}`
  return get(dvf, endpoint)
}
