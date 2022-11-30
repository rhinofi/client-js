const { Joi } = require('@rhino.fi/dvf-utils')

const get = require('../../lib/dvf/get-authenticated')
const validateWithJoi = require('../../lib/validators/validateWithJoi')

const schema = Joi.object({
  poolName: Joi.string()
})

const validateData = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'getRewardsLockedState'
})

module.exports = (dvf, data, nonce, signature) => {
  const { poolName } = validateData(data)
  const endpoint = `/v1/trading/amm/rewardsLockedState/${poolName}`

  return get(dvf, endpoint, nonce, signature)
}
