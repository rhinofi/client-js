validateOrderId = require('./validateOrderId')
validateSymbol = require('./validateSymbol')
validateToken = require('./validateToken')
validateNonce = require('./validateNonce')
validateSignature = require('./validateSignature')

var result = ''
module.exports = parameters => {
  var keys = Object.keys(parameters)
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]

    // if (key === 'orderId') {
    // 	result = validateOrderId(parameters[key])
    // 	if (result) return result;
    // }
    // if (key === 'symbol') {
    //     result = validateSymbol(parameters[key])
    // 	if (result) return result;
    // }
    // if (key === 'token') {
    // 	result = validateToken(parameters[key]);
    // 	if (result) return result;
    // }
    // if (key === 'nonce') {
    // 	result = validateNonce(parameters[key]);
    // 	if (result) return result;
    // }
    // if (key === 'signature') {
    // 	result = validateSignature(parameters[key]);
    // 	if (result) return result;
    // }
    switch (key) {
      case 'orderId': {
        result = validateOrderId(parameters[key])
        if (result) return result
        else break
      }
      case 'symbol': {
        result = validateSymbol(parameters.efx, parameters[key])
        if (result) return result
        else break
      }
      case 'token': {
        result = validateToken(parameters.efx, parameters[key])
        if (result) return result
        else break
      }
      case 'nonce': {
        result = validateNonce(parameters[key])
        if (result) return result
        else break
      }
      case 'signature': {
        result = validateSignature(parameters[key])
        if (result) return result
        else break
      }
    }
  }
  return false
}
