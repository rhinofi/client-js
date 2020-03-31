const FP = require('lodash/fp')

// TODO: define a schema for data.
// Default (like the type, protocol, feeRate below) can  go on that schema.
module.exports = async (dvf, data) => {
  // allow passing in ethAddress (useful for testing).
  const ethAddress = data.ethAddress || dvf.get('account')

  return {
    type: 'EXCHANGE LIMIT',
    protocol: 'stark',
    feeRate: 0.0025,
    ...(
      FP.pick([
          'amount',
          'cid',
          'dynamicFeeRate',
          'feeRate',
          'gid',
          'partnerId',
          'price',
          'symbol',
        ],
        data
      )
    ),
    meta: {
      ethAddress,
      ...(await dvf.createOrderMetaData(data))
    }
  }
}
