const { Joi } = require('dvf-utils')

const postGeneric = require('../lib/dvf/post-generic')
const validateWithJoi = require('../lib/validators/validateWithJoi')

const schema = Joi.object({
  walletType: Joi.string(),
  errorText: Joi.string()
})

const validateData = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'walletFailedEvent'
})

module.exports = async (dvf, data) => {
  const endpoint = '/v1/trading/w/walletFailedEvent'
  const { walletType, errorText } = validateData(data)
  return postGeneric(dvf, endpoint, { walletType, errorText })
}
