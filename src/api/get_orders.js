const { post } = require('request-promise')
const parse = require('../lib/parse/response/orders')

module.exports = async (efx, symbol, id, nonce, signature) => {
  let url = efx.config.api + '/r/orders'

  if (symbol) {
    url += '/t' + symbol
  }

  const protocol = '0x'

  if (!nonce) {
    nonce = ((Date.now() / 1000) + 30) + ''

    signature = await efx.sign(nonce.toString(16))
  }

  const data = {id, nonce, signature, protocol}

  return parse(post(url, {json: data}))
}
