const {post} = require('request-promise')
const parse = require('../lib/parse/response/cancel_order')

module.exports = async (efx, orderId, signature) => {
  if (!signature) {
    signature = await efx.sign.cancelOrder(orderId)
  }

  const url = efx.config.api + '/w/oc'

  const protocol = '0x'

  orderId = parseInt(orderId)
  const data = {orderId, protocol, signature}

  return parse(post(url, {json: data}))
}
