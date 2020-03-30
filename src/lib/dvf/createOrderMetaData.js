const validateProps = require('../validators/validateProps')
const validateAssertions = require('../validators/validateAssertions')

const starkSignedOrder = async (
  dvf,
  starkPrivateKey,
  starkMessage
) => {
  validateAssertions(dvf, {starkPrivateKey})

  const { starkKeyPair, starkPublicKey } = await dvf.stark.createKeyPair(
    starkPrivateKey
  )

  const starkSignature = dvf.stark.sign(starkKeyPair, starkMessage)

  return {
    starkPublicKey,
    starkSignature
  }
}

module.exports = async (
  dvf,
  orderData
) => {
  validateProps(dvf, ['amount', 'symbol', 'price'], orderData)

  // TODO: refactor createOrder to accept orderData
  const { starkOrder, starkMessage } = await dvf.stark.createOrder(
    orderData.symbol,
    orderData.amount,
    orderData.price,
    orderData.validFor,
    orderData.feeRate
  )

  const {
    starkPublicKey,
    starkSignature
  } = await (orderData.ledgerPath ?
    dvf.stark.ledger.createSignedOrder(path, starkOrder)
    :
    starkSignedOrder(dvf, orderData.starkPrivateKey, starkMessage)
  )

  return {
    starkPublicKey,
    starkOrder,
    starkMessage,
    starkSignature
  }
}
