const validators = {
  id: require('./id'),
  orderId: require('./orderId'),
  cid: require('./cid'),
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

module.exports = (dvf, parameters) => {
  for (const [key, value] of Object.entries(parameters)) {

    if (!validators[key]) {
      continue
    }

    const result = validators[key](dvf, value)

    if (result) {
      return result
    }
  }

  return false
}
