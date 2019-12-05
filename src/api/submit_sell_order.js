const {post} = require('request-promise')
const parse = require('../lib/parse/response/submit_order')

module.exports = (efx, symbol, amount, price, gid, cid, signedOrder, validFor, partner_id, fee_rate) => {

  // force amount to be negative ( sell order )
  amount = Math.abs(amount) * -1

  return efx.submitOrder(symbol, amount, price, gid, cid, signedOrder, validFor, partner_id, fee_rate)
}
