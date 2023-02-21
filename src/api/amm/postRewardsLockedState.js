const { Joi } = require('@rhino.fi/dvf-utils')

const post = require('../../lib/dvf/post-authenticated')
const validateWithJoi = require('../../lib/validators/validateWithJoi')

const schema = Joi.object({
  poolName: Joi.string(),
  wrapped: Joi.boolean()
})

const validateData = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'postRewardsLockedState'
})

module.exports = (dvf, data, nonce, signature) => {
  const { poolName, wrapped } = validateData(data)
  const endpoint = `/v1/trading/amm/rewardsLockedState/${poolName}`
  return post(dvf, endpoint, nonce, signature, { wrapped })
}
