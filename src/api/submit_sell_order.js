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
  dynamicFeeRate,
  vault_id_buy,
  vault_id_sell
) => {
  // force amount to be negative ( sell order )
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
    dynamicFeeRate,
    vault_id_buy,
    vault_id_sell
  )
}
