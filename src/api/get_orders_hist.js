module.exports = (efx, symbol, nonce, signature) => {
  let orderId = 'hist'
  return efx.getOrders(symbol, orderId, nonce, signature)
}
