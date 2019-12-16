module.exports = (efx, symbol, nonce, signature) => {
  return efx.getOrders(symbol, id='hist', nonce, signature)
}
