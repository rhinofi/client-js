const { Joi } = require('dvf-utils')

const postGeneric = require('../lib/dvf/post-generic')
const validateWithJoi = require('../lib/validators/validateWithJoi')

const schema = Joi.object({
  walletType: Joi.string(),
  successText: Joi.string()
})

const validateData = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'walletSuccessEvent'
})

module.exports = async (dvf, data) => {
  const endpoint = '/v1/trading/w/walletSuccessEvent'
  const { walletType, successText } = validateData(data)
  return postGeneric(dvf, endpoint, { walletType, successText })
}
