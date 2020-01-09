const validateOrderId = require('./validateOrderId'),
  validateSymbol = require('./validateSymbol'),
  validateToken = require('./validateToken'),
  validateNonce = require('./validateNonce'),
  validateSignature = require('./validateSignature'),
  validateAmount = require('./validateAmount'),
  validatePrice = require('./validatePrice'),
  validateStarkKey = require('./validateStarkKey'),
  validateStarkKeyPair = require('./validateStarkKeyPair'),
  validateAddress = require('./validateAddress')

module.exports = async parameters => {
  const keys = Object.keys(parameters)
  for (let key of keys) {
    if ((result = await assertionErrors(key, parameters[key], parameters.dvf))) { return result }
  }
  return false
}

const validators = {
  orderId: validateOrderId,
  symbol: validateSymbol,
  token: validateToken,
  nonce: validateNonce,
  signature: validateSignature,
  amount: validateAmount,
  price: validatePrice,
  starkKey: validateStarkKey,
  starkKeyPair: validateStarkKeyPair,
  ethAddress: validateAddress
}

const assertionErrors = (param, value, dvf) => {
  if (!validators[param]) return
  return validators[param](dvf, value)
}
