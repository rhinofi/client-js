const { post } = require('request-promise')
const DVFError = require('../lib/dvf/DVFError')
const { Joi } = require('dvf-utils')
/*
Keeping the schema visible and not in a seperate method
for reference as required parameters can be checked by reading
*/


const schema = Joi.object({
  symbol: Joi.string().required(), // trading symbol
  amount: Joi.amount().required(), // number or number string
  price: Joi.price().required(), // number or number string
  starkPrivateKey: Joi.string(), // required when using KeyStore wallet
  ledgerPath: Joi.string(), // required when using Ledger wallet
  validFor: Joi.number().allow(''), // validation time in hours
  feeRate: Joi.number().allow(''), // feeRate if known
  cid: Joi.string().allow(''),
  gid: Joi.string().allow(''),
  partnerId: Joi.string().allow(''),
  ethAddress: Joi.string().pattern(/[\da-f]/i),
  type: Joi.any().default('EXCHANGE LIMIT'),
  protocol: Joi.any().default('stark'),
  isPostOnly: Joi.bool().description('Flag to indicate if the order is post-only.'),
  isHidden: Joi.bool().description('Flag to indicate if the order is hidden.'),
  isIgnoringSlippage: Joi.bool().description('Flag to indicate if the order should ignore slippage.'),
  isFillOrKill: Joi.bool().description('Flag to indicate if the order is fill-or-kill'),
  nonce: Joi.string().allow(''),
  signature: Joi.string().allow('')
})

module.exports = async (dvf, orderData) => {
  const { value, error } = schema.validate(orderData)

  // TODO: add handling of all possible joi validation errors, converting
  //   them to appropriate DVFError
  if (error) {
    const details = error.details[0]
    switch (details.path[0]) {
      case 'symbol':
        throw new DVFError('ERR_INVALID_SYMBOL', { details })
      case 'amount':
        throw new DVFError('ERR_AMOUNT_MISSING', { details })
      case 'price':
        throw new DVFError('ERR_PRICE_MISSING', { details })
      default:
        throw new DVFError('UNEXPECTED', details)
    }
  }

  return post(dvf.config.api + '/v1/trading/w/submitOrder', {
    json: await dvf.createOrderPayload(value)
  })
}
