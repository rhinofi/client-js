validateOrderId = require('./validateOrderId')
validateSymbol = require('./validateSymbol')
validateToken = require('./validateToken')
validateNonce = require('./validateNonce')
validateSignature = require('./validateSignature')
validateAmount = require('./validateAmount')
validatePrice = require('./validatePrice')
validateStarkKey = require('./validateStarkKey')
validateStarkKeyPair = require('./validateStarkKeyPair')

module.exports = parameters => {
  var keys = Object.keys(parameters)
  for (let key of keys) {
    if ((result = assertionErrors(key, parameters[key], parameters.efx))) { return result }
  }
  return false
}

assertionErrors = (param, value, efx) => {
  const validators = {
    orderId: validateOrderId(value),
    symbol: validateSymbol(efx, value),
    token: validateToken(efx, value),
    nonce: validateNonce(value),
    signature: validateSignature(value),
    amount: validateAmount(value),
    price: validatePrice(value),
    starkKey: validateStarkKey(value),
    starkKeyPair: validateStarkKeyPair(value)
  }
  return validators[param]
}
