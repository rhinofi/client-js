module.exports = (efx, orderId, nonce, signature) => {
  return efx.getOrders(null, '', nonce, signature)
}
