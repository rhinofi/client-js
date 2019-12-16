const { post } = require('request-promise')

// module.exports = (efx, symbol, amount, price, gid, cid, signedOrder, validFor, partner_id, fee_rate) => {
module.exports = (
  efx,
  symbol,
  amount,
  price,
  gid,
  cid,
  signedOrder,
  validFor,
  partner_id,
  fee_rate,
  dynamicFeeRate
) => {
  // force amount to be positive ( buy order )
  amount = Math.abs(amount)
  return efx.submitOrder(
    symbol,
    amount,
    price,
    gid,
    cid,
    signedOrder,
    validFor,
    partner_id,
    fee_rate,
    dynamicFeeRate
  )
}
