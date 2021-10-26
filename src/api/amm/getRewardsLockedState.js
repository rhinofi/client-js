const { Joi } = require('dvf-utils')

const get = require('../../lib/dvf/get-authenticated')
const validateWithJoi = require('../../lib/validators/validateWithJoi')

const schema = Joi.object({
  pool: Joi.string()
})

const validateData = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'getRewardsLockedState'
})

module.exports = (dvf, data, nonce, signature) => {
  const { pool } = validateData(data)
  const endpoint = `/v1/trading/amm/rewardsLockedState/${pool}`

  return get(dvf, endpoint, nonce, signature)
}
