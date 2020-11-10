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
  // force amount to be negative ( sell order )
  amount = Math.abs(amount) * -1
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
