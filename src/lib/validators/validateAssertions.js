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
  for (const key of keys) {
    const error = await assertionErrors(key, parameters[key], parameters.dvf)
    if (!error) {
      continue
    }
    return error
  }
  return null
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
  ethAddress: validateAddress,
  deFiSignature: validateSignature
}

const assertionErrors = (param, value, dvf) => {
  if (!validators[param]) return
  return validators[param](dvf, value)
}
