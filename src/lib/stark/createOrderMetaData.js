const validAssertions = require('../validators/validateAssertions')

module.exports = async (
  dvf,
  symbol,
  amount,
  price,
  validFor,
  feeRate = 0.0025,
  starkPrivateKey
) => {
  validAssertions(dvf, { amount, symbol, price, starkPrivateKey })

  const { starkOrder, starkMessage } = dvf.stark.createOrder(
    symbol,
    amount,
    price,
    validFor,
    feeRate
  )

  const { starkKeyPair, starkPublicKey } = await dvf.stark.createKeyPair(
    starkPrivateKey
  )

  const starkSignature = dvf.stark.sign(starkKeyPair, starkMessage)

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
