const FP = require('lodash/fp')
const { Joi, toBN, prepareAmount } = require('dvf-utils')

/*
repeating the schema here as this method can be called on its own
and keeping the schema visible and not in a seperate method
for reference as required parameters and tyoes can be checked
by reading the schema
*/
const schema = Joi.object({
  symbol: Joi.string().required(), // trading symbol
  amountToSell: Joi.amount().required(), // number or number string
  tokenToSell: Joi.string().required(), // token to sell
  worstCasePrice: Joi.price().required(), // number or number string
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
  nonce: Joi.string().allow(''),
  signature: Joi.string().allow('')
})

module.exports = async (dvf, orderData) => {
  const { value, error } = schema.validate(orderData)
  // TODO: handle error

  const ethAddress = orderData.ethAddress || dvf.get('account')

  const amountToSellBN = toBN(value.amountToSell)
  const baseSymbol = value.symbol.split(':')[0]
  const amountBN = value.tokenToSell === baseSymbol
    ? amountToSellBN.negated()
    : amountToSellBN.div(value.worstCasePrice)

  const finalValue = {
    ...value,
    feeRate: value.feeRate || dvf.config.DVF.defaultFeeRate,
    amount: prepareAmount(amountBN),
    price: value.worstCasePrice
  }

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
      finalValue
    ),
    meta: {
      ethAddress,
      ...(await dvf.createMarketOrderMetaData(finalValue))
    }
  }
}
