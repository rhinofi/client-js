const { post } = require('request-promise')
const parse = require('../lib/parse/response/orders')

module.exports = async (efx, symbol, orderId, nonce, signature) => {
  var url = efx.config.api + '/r/openOrders'
  
  if (orderId === 'hist') {
      url = efx.config.api + '/r/orderHistory'
  }

  if (!nonce) {
    nonce = Date.now() / 1000 + 30 + ''
    signature = await efx.sign(nonce.toString(16))
  }

  const data = {
    nonce,
    signature,
    symbol
  }

  return parse(post(url, { json: data }))
}
