const { Joi } = require('dvf-utils')

const get = require('../../lib/dvf/get-authenticated')
const validateWithJoi = require('../../lib/validators/validateWithJoi')

const schema = Joi.object({
  pool: Joi.string(),
  token: Joi.string(),
  amount: Joi.bigNumber().greaterThan(0)
})

const validateData = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'ammGetFundingOrders.js'
})

const endpoint = '/v1/trading/amm/fundingOrderData'

module.exports = (dvf, data, nonce, signature) => {
  // convert `amount` to string, since it's passed as a query string parameter, and bigNumber vars aren't converted
  const validatedData = validateData(data)
  const requestData = { ...validatedData, amount: validatedData.amount.toString() }
  
  return get(dvf, endpoint, nonce, signature, requestData)
}
