const { Joi } = require('dvf-utils')
const getAuthenticated = require('../../lib/dvf/get-authenticated')

const validateWithJoi = require('../../lib/validators/validateWithJoi')

const schema = Joi.alternatives().try(
  Joi.object({
    ammFundingOrderId: Joi.string()
  }),
  Joi.object({
    sortDirection: Joi.string()
      .valid('DESC', 'ASC')
      .optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date()
      .greater(Joi.ref('startDate'))
      .optional(),
    skip: Joi.number()
      .integer()
      .min(0)
      .optional(),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .optional(),
    pool: Joi.string().optional()
  })
)

const validateData = validateWithJoi(schema)('INVALID_METHOD_ARGUMENT')({
  context: 'getAmmFundingOrders'
})

module.exports = (dvf, nonce, signature, data, headers) => {
  const validatedData = validateData(data)
  const endpoint = `/v1/trading/amm/fundingOrders`
  if (validatedData.ammFundingOrderId) {
    return getAuthenticated(
      dvf,
      `${endpoint}/${validatedData.ammFundingOrderId}`,
      nonce,
      signature
    )
  }
  return getAuthenticated(dvf, endpoint, nonce, signature, validatedData, headers)
}
