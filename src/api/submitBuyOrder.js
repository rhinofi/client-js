module.exports = (
  dvf,
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
  starkKey,
  starkKeyPair
) => {
  // force amount to be positive ( buy order )
  amount = Math.abs(amount)
  return dvf.submitOrder(
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
    starkKey,
    starkKeyPair
  )
}
