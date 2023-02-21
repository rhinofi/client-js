const P = require('aigle')
let order
const orders = await rhinofi.getOrders()

console.log('orders', orders)

if (orders.length == 0) {
  console.log('submitting new order')

  // Submit an order to sell 0.1 ETH at a the price of 5000 USDT per ETH
  const symbol = 'ETH:USDT'
  const amount = -0.1
  const price = 5000
  const validFor = '0'
  const feeRate = ''

  order = await rhinofi.submitOrder({
    symbol,
    amount,
    price,
    starkPrivateKey: starkPrivKey,
    validFor,           // Optional
    feeRate,            // Optional
    gid: '1',           // Optional
    cid: 'mycid-cancel-example-' + Math.random().toString(36).substring(7), // Optional
    partnerId: 'P1'    // Optional
  })

  console.log('submitOrder response ->', order)

  while (true) {
    console.log('checking if order appears on the book...')
    if ((await rhinofi.getOrders()).find(o => o._id === order._id)) break
    await P.delay(1000)
  }
}
else {
  order = orders[0]
}

console.log('cancelling orderId', order._id)

const response = await rhinofi.cancelOrder(order._id)
// Alternative with cid :
// const response = await rhinofi.cancelOrder({ cid: order.cid })

logExampleResult(response)
