const P = require('aigle')

const defaultOrderProps = Object.freeze({
  cid: 'mycid-' + Math.random().toString(36).substring(7),
  // Order to sell 0.1 ETH at a the price of 100000 USDT per ETH.
  symbol: 'ETH:USDT',
  amount: -0.1,
  // We are asking a hight price to ensure that the order stays on the book
  price: 100000
})

module.exports = async (rhinofi, starkPrivateKey, orderProps = defaultOrderProps) => {
  const orders = await rhinofi.getOrders(orderProps.symbol)

  if (orders.length > 0) {
    return orders[0]
  }

  console.log('submitting new order')

  const order = await rhinofi.submitOrder({ ...orderProps, starkPrivateKey })

  console.log('waiting until order appears on the book...')
  while (true) {
    // TODD:
    if ((await rhinofi.getOrder(order._id)).active === true) break
    await P.delay(1000)
    console.log('still waiting...')
  }

  return order
}
