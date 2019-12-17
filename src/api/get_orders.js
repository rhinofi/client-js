const { post } = require('request-promise')
const parse = require('../lib/parse/response/orders')

module.exports = async (efx, symbol, id, nonce, signature) => {
  var url = efx.config.api + '/r/getOrders'
  if (id === 'hist') {
    if (symbol) {
      url += '/t' + symbol + '/hist'
    } else {
      url += '/hist'
    }
    // if it is from orderHistory, make id to null
    id = null
  } else {
    if (symbol) {
      url += '/t' + symbol
    }
  }
  if (!nonce) {
    nonce = Date.now() / 1000 + 30 + ''
    signature = await efx.sign(nonce.toString(16))
  }
  const protocol = '0x'

  const data = {
    id,
    nonce,
    signature,
    protocol
  }
  return parse(post(url, { json: data }))
}
