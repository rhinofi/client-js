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
  starkKey,
  starkKeyPair
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
    starkKey,
    starkKeyPair
  )
}
