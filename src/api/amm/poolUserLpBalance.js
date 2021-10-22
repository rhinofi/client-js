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
  const endpoint = `/v2/trading/amm/poolLpBalance/${pool}`
  return {
    pool,
    user: '0x96b5834632ea9546ba0c990574ba8e348603f93c',
    lpBalance: 1500
  }
  return getAuthenticated(dvf, endpoint, nonce, signature)
}
