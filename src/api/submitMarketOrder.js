const { post } = require('request-promise')
const { Joi } = require('dvf-utils')
/*
Keeping the schema visible and not in a seperate method
for reference as required parameters can be checked by reading
*/
const schema = Joi.object({
  symbol: Joi.string().required(), // trading symbol
  tokenToSell: Joi.string().required(), // token to be sold
  amountToSell: Joi.amount().required(), // number or number string
  worstCasePrice: Joi.price().required(), // number or number string
  starkPrivateKey: Joi.string(), // required when using KeyStore wallet
  ledgerPath: Joi.string(), // required when using Ledger wallet
  validFor: Joi.number().allow(''), // validation time in hours
  feeRate: Joi.number().allow(''), // feeRate if known
  cid: Joi.string().allow(''),
  gid: Joi.string().allow(''),
  partnerId: Joi.string().allow(''),
  ethAddress: Joi.string().pattern(/[\da-f]/i),
  feature: Joi.string().default('UNKNOWN'), // Tracks order origin (ex: 'TRADING', 'SWAP')
  platform: Joi.string().valid('DESKTOP', 'MOBILE').default('DESKTOP'), // Tracks order platform (DESKTOP or MOBILE)
  type: Joi.string().default('EXCHANGE MARKET'),
  protocol: Joi.any().default('stark'),
  isPostOnly: Joi.bool().description('Flag to indicate if the order is post-only.'),
  isHidden: Joi.bool().description('Flag to indicate if the order is hidden.'),
  nonce: Joi.string().allow(''),
  signature: Joi.string().allow('')
})

module.exports = async (dvf, orderData) => {
  const { value, error } = schema.validate(orderData)
  // TODO handle error
  return post(dvf.config.api + '/v1/trading/w/submitOrder', {
    headers: { Authorization: dvf.config.apiKey},
    json: await dvf.createMarketOrderPayload(value)
  })
}
