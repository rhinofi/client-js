const { Joi } = require('dvf-utils')
const get = require('../lib/dvf/get-generic')
const validateWithJoi = require('../lib/validators/validateWithJoi')

const schema = Joi.object({
  targetEthAddress: Joi.ethAddress()
})

const validateInputs = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: `getRegistrationStatuses`
})

module.exports = async (dvf, data) => {
  const { targetEthAddress } = validateInputs(data)

  const endpoint = `/v1/trading/registrations/${targetEthAddress}`
  return get(dvf, endpoint)
}
