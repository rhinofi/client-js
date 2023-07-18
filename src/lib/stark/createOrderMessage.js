const sw = require('@rhino.fi/starkware-crypto')
const DVFError = require('../dvf/DVFError')

module.exports = (dvf, starkOrder) => {
  try {
    const message = (dvf.sw || sw).getLimitOrderMsgHash(
      starkOrder.vaultIdSell,
      starkOrder.vaultIdBuy,
      starkOrder.amountSell,
      starkOrder.amountBuy,
      starkOrder.tokenSell,
      starkOrder.tokenBuy,
      starkOrder.nonce,
      starkOrder.expirationTimestamp
    )
    return dvf.sw ? message.toString(16) : message
  } catch (err) {
    console.error('ERR_CREATING_STARK_ORDER_MESSAGE: error', err)
    throw new DVFError('ERR_CREATING_STARK_ORDER_MESSAGE')
  }
}
