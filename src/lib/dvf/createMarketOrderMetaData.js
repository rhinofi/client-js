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
  const { starkOrder, starkMessage } = await dvf.stark.createOrder(orderData)
  let starkPublicKey, starkSignature

  if (orderData.starkPrivateKey) {
    ({ starkPublicKey, starkSignature } = await starkSignedOrder(dvf, orderData.starkPrivateKey, starkMessage))
  } else if (orderData.ledgerPath) {
    ({ starkPublicKey, starkSignature } = await dvf.stark.ledger.createSignedOrder(orderData.ledgerPath, starkOrder, { starkMessage }))
  }

  return {
    starkPublicKey,
    starkOrder,
    starkMessage,
    starkSignature
  }
}
