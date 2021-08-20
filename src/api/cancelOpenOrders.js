const post = require('../lib/dvf/post-authenticated')

/**
 * Cancel all open orders for the current user
 * If `canceled` is true for the given order, it has been successfully canceled
 * otherwise it will be queued for cancellation unless it is no longer `active`
 * @returns {object[]} { orderId: string, canceled: boolean, active: boolean}
 */
module.exports = async (dvf, nonce, signature) => {
  const endpoint = '/v1/trading/w/cancelOpenOrders'

  return post(dvf, endpoint, nonce, signature, {})
}
