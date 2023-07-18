const { Joi } = require('@rhino.fi/dvf-utils')
const get = require('../../lib/dvf/get-generic')
const validateWithJoi = require('../../lib/validators/validateWithJoi')

const schema = Joi.object({
  user: Joi.ethAddress().optional(),
  token: Joi.string().optional(),
  memo: Joi.string().optional(),
  skip: Joi.number().optional(),
  limit: Joi.number().optional()
})

const validateInputs = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'bitfinex/transfers'
})

module.exports = async (dvf, id, data) => {
  const endpoint = '/v1/trading/bitfinex/transfers'

  if (id) {
    return get(dvf, `${endpoint}/${id}`)
  }

  const { user, token, memo, skip, limit } = validateInputs(data)
  return get(dvf, endpoint, { user, token, memo, skip, limit })
}
