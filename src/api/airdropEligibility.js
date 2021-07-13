const { Joi } = require('dvf-utils')
const get = require('../lib/dvf/get-generic')
const validateWithJoi = require('../lib/validators/validateWithJoi')

const schema = Joi.ethAddress()

const validateInputs = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'airdropEligibility'
})

module.exports = async (dvf, _ethAddress) => {
  const ethAddress = validateInputs(_ethAddress)
  const endpoint = `/v1/trading/r/airdropEligibility?ethAddress=${ethAddress}`
  return get(dvf, endpoint)
}
