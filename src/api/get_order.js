module.exports = (efx, orderId) => {
  return efx.getOrders(null, orderId)
}
