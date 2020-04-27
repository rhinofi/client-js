const { post } = require('request-promise')
const Joi = require('@hapi/joi')
/*
Keeping the schema visible and not in a seperate method
for reference as required parameters can be checked by reading
*/
const schema = Joi.object({
  symbol: Joi.string().required(), // trading symbol
  amount: Joi.number().required(), // number or number string
  price: Joi.number().required(), // number or number string
  starkPrivateKey: Joi.string(), // required when using KeyStore wallet
  ledgerPath: Joi.string(), // required when using Ledger wallet
  validFor: Joi.number().allow(''), // validation time in hours
  feeRate: Joi.number().allow(''), // feeRate if known
  cid: Joi.string().allow(''),
  gid: Joi.string().allow(''),
  partnerId: Joi.string().allow(''),
  ethAddress: Joi.string().pattern(/[\da-f]/i),
  type: Joi.any().default('EXCHANGE LIMIT'),
  protocol: Joi.any().default('stark')
})

module.exports = async (dvf, orderData) => {
  const { value } = schema.validate(orderData)
  return post(dvf.config.api + '/v1/trading/w/submitOrder', {
    json: await dvf.createOrderPayload(value)
  })
}
