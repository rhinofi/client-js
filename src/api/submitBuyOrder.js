module.exports = (
  dvf,
  symbol,
  amount,
  price,
  gid,
  cid,
  signedOrder,
  validFor,
  partnerId,
  feeRate,
  starkPrivateKey
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
    partnerId,
    feeRate,
    starkPrivateKey
  )
}
