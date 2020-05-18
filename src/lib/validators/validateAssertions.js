const validators = {
  orderId: require('./orderId'),
  symbol: require('./symbol'),
  token: require('./token'),
  tokenToSell: require('./token'),
  nonce: require('./nonce'),
  signature: require('./deFiSignature'),
  amount: require('./amount'),
  amountToSell: require('./amount'),
  price: require('./price'),
  worstCasePrice: require('./price'),
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

    if(result) { 
      return result 
    }
  }
  
  return false
}