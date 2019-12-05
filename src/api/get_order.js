/**
 *
 * A simple alias that specify an order when calling efx.getOrders method
 */
module.exports = async (efx, id, nonce, signature) => {
  return efx.getOrders(null, id, nonce, signature)
}
