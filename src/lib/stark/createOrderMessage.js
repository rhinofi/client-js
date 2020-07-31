const sw = require('starkware_crypto')
const DVFError = require('../dvf/DVFError')

module.exports = (dvf, starkOrder) => {
  try {
    const message = (dvf.swCpp || sw).get_limit_order_msg(
      starkOrder.vaultIdSell,
      starkOrder.vaultIdBuy,
      starkOrder.amountSell,
      starkOrder.amountBuy,
      starkOrder.tokenSell,
      starkOrder.tokenBuy,
      starkOrder.nonce,
      starkOrder.expirationTimestamp
    )
    return dvf.swCpp ? message.toString(16) : message
  } catch (err) {
    console.error('ERR_CREATING_STARK_ORDER_MESSAGE: error', err)
    throw new DVFError('ERR_CREATING_STARK_ORDER_MESSAGE')
  }
}
