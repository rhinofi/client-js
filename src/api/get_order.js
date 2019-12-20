module.exports = (efx, orderId, nonce, signature) => {
  return efx.getOrders(null, orderId, nonce, signature)
}
