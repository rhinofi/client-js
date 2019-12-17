module.exports = (efx, symbol, nonce, signature) => {
  let id = 'hist'
  return efx.getOrders(symbol, id, nonce, signature)
}
