const { post } = require('request-promise')
const FP = require('lodash/fp')
// TODO: define a schema for data and validate it.
module.exports = async (dvf, orderData) => {
  // allow passing in ethAddress (useful for testing).
  const ethAddress = orderData.ethAddress || dvf.get('account')

  data = {
    type: 'EXCHANGE LIMIT',
    protocol: 'stark',
    feeRate: 0.0025,
    ...FP.pick(
      [
        'amount',
        'cid',
        'dynamicFeeRate',
        'feeRate',
        'gid',
        'partnerId',
        'price',
        'symbol'
      ],
      orderData
    ),
    meta: {
      ethAddress,
      ...(await dvf.createOrderMetaData(orderData))
    }
  }
  const url = dvf.config.api + '/v1/trading/w/submitOrder'

  return post(url, { json: data })
}
