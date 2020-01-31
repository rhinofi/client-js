const sw = require('starkware_crypto')
const errorReasons = require('.././../lib/error/reasons')

module.exports = starkOrder => {
  try {
    const message = sw.get_limit_order_msg(
      starkOrder.vaultIdSell,
      starkOrder.vaultIdBuy,
      starkOrder.amountSell,
      starkOrder.amountBuy,
      starkOrder.tokenSell,
      starkOrder.tokenBuy,
      starkOrder.nonce,
      starkOrder.expirationTimestamp
    )
    return message
  } catch (err) {
    return {
      error: 'ERR_CREATING_STARK_ORDER_MESSAGE',
      reason: errorReasons.ERR_CREATING_STARK_ORDER_MESSAGE
    }
  }
}
