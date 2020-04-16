const FP = require('lodash/fp')
const validateAssertions = require('./validateAssertions')

const validators = {
  orderId: require('./orderId'),
  symbol: require('./symbol'),
  token: require('./token'),
  nonce: require('./nonce'),
  signature: require('./deFiSignature'),
  amount: require('./amount'),
  price: require('./price'),
  starkPublicKey: require('./starkPublicKey'),
  starkKeyPair: require('./starkKeyPair'),
  ethAddress: require('./ethAddress'),
  deFiSignature: require('./deFiSignature'),
  starkPrivateKey: require('./starkPrivateKey'),
  withdrawalId: require('./withdrawalId')
}

module.exports = (dvf, props, obj) => validateAssertions(
  dvf,
  FP.pick(props, obj)
)
