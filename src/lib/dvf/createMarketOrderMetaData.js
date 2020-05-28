const validateProps = require('../validators/validateProps')
const validateAssertions = require('../validators/validateAssertions')

const starkSignedOrder = async (dvf, starkPrivateKey, starkMessage) => {
  validateAssertions(dvf, { starkPrivateKey })

  const { starkKeyPair, starkPublicKey } = await dvf.stark.createKeyPair(
    starkPrivateKey
  )

  const starkSignature = dvf.stark.sign(starkKeyPair, starkMessage)

  return {
    starkPublicKey,
    starkSignature
  }
}

module.exports = async (dvf, orderData) => {
  validateProps(dvf, ['amountToSell', 'symbol', 'tokenToSell', 'worstCasePrice'], orderData)

  const { starkOrder, starkMessage, settleSpreadBuy, settleSpreadSell } = await dvf.stark.createMarketOrder(orderData)

  const { starkPublicKey, starkSignature } = await (orderData.ledgerPath
    ? dvf.stark.ledger.createSignedOrder(orderData.ledgerPath, starkOrder)
    : starkSignedOrder(dvf, orderData.starkPrivateKey, starkMessage))

  return {
    starkPublicKey,
    starkOrder,
    starkMessage,
    starkSignature,
    settleSpreadBuy,
    settleSpreadSell
  }
}
