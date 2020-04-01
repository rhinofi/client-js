const FP = require('lodash/fp')

// TODO: define a schema for orderData.
// Default (like the type, protocol, feeRate below) can  go on that schema.
module.exports = async (dvf, orderData) => {
  // allow passing in ethAddress (useful for testing).
  const ethAddress = orderData.ethAddress || dvf.get('account')

  return {
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
}
