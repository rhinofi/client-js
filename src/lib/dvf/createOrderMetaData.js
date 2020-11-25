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
  validateProps(dvf, ['amount', 'symbol', 'price'], orderData)

  const { starkOrder, starkMessage } = await dvf.stark.createOrder(orderData)
  let starkPublicKey, starkSignature
  if (orderData.starkPrivateKey) {
    ({starkPublicKey, starkSignature} = await starkSignedOrder(dvf, orderData.starkPrivateKey, starkMessage))
  } else if (orderData.ledgerPath) {
    ({starkPublicKey, starkSignature} = await dvf.stark.ledger.createSignedOrder(orderData.ledgerPath, starkOrder))
  } else if (dvf.config.starkProvider) {
    ({starkPublicKey, starkSignature} = await dvf.stark.authereum.createSignedOrder(starkOrder))
  }

  return {
    starkPublicKey,
    starkOrder,
    starkMessage,
    starkSignature
  }
}
