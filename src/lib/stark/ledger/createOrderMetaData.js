const validAssertions = require('../../validators/validateAssertions')

module.exports = async (
  dvf,
  symbol,
  amount,
  price,
  validFor,
  feeRate = 0.0025,
  path
) => {
  validAssertions(dvf, { amount, symbol, price })

  const { starkOrder, starkMessage } = await dvf.stark.createOrder({
    symbol,
    amount,
    price,
    validFor,
    feeRate
  })

  const {
    starkPublicKey,
    starkSignature
  } = await dvf.stark.ledger.createSignedOrder(path, starkOrder)

  return {
    starkPublicKey,
    starkOrder,
    starkMessage,
    starkSignature,
    symbol,
    amount,
    price
  }
}
