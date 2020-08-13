const FP = require('lodash/fp')
const { Joi } = require('dvf-utils')
/*
repeating the schema here as this method can be called on its own
and keeping the schema visible and not in a seperate method
for reference as required parameters and tyoes can be checked
by reading the schema
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
  isHidden: Joi.bool().description('Flag to indicate if the order is hidden.')
})

module.exports = async (dvf, orderData) => {
  const { value, error } = schema.validate(orderData)
  // TODO: handle error
  // TODO: don't mutate
  value.feeRate = value.feeRate || dvf.config.DVF.defaultFeeRate
  const ethAddress = orderData.ethAddress || dvf.get('account')

  return {
    ...FP.pick(
      [
        'amount',
        'cid',
        'feeRate',
        'gid',
        'partnerId',
        'price',
        'symbol',
        'type',
        'protocol',
        'isPostOnly',
        'isHidden'
      ],
      value
    ),
    meta: {
      ethAddress,
      ...(await dvf.createOrderMetaData(value))
    }
  }
}
