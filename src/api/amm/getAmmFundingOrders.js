const { Joi } = require('dvf-utils')

const get = require('../../lib/dvf/get-generic')
const validateWithJoi = require('../../lib/validators/validateWithJoi')

const schema = Joi.object({
  ammFundingOrderId: Joi.string()
})

const validateData = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'getAmmFundingOrders'
})

module.exports = (dvf, data) => {
  const { ammFundingOrderId } = validateData(data)
  const endpoint = `/v1/trading/amm/fundingOrders/${ammFundingOrderId}`
  return get(dvf, endpoint)
}
