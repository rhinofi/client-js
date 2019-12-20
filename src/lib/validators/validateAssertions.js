validateOrderId = require('./validateOrderId')
validateSymbol = require('./validateSymbol')
validateToken = require('./validateToken')
validateNonce = require('./validateNonce')

module.exports = (parameters) => {
    var keys = Object.keys(parameters)
	for (var i = 0; i < keys.length; i++) {
        var key = keys[i]
        switch (key){
            case 'orderId': return validateOrderId(parameters[key])
            case 'symbol': return validateSymbol(parameters.efx, parameters[key])
            case 'token': return validateToken(parameters.efx, parameters[key])
            case 'nonce': return validateNonce(parameters[key])
            case 'signature': return validateNonce(parameters[key])
            
        }
    }
    return false
}
