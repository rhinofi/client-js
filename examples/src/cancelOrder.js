const P = require('aigle')
let orderId
const orders = await dvf.getOrders()

console.log('orders', orders)

if (orders.length == 0) {
  console.log('submitting new order')

  // Submit an order to sell 0.1 ETH at a the price of 5000 USDT per ETH
  const symbol = 'ETH:USDT'
  const amount = -0.1
  const price = 5000
  const validFor = '0'
  const feeRate = ''

  const submitOrderResponse = await dvf.submitOrder({
    symbol,
    amount,
    price,
    starkPrivateKey: starkPrivKey,
    validFor,           // Optional
    feeRate,            // Optional
    gid: '1',           // Optional
    cid: '1',           // Optional
    partnerId: 'P1'    // Optional
  })

  console.log('submitOrder response ->', submitOrderResponse)

  orderId = submitOrderResponse._id

  while (true) {
    console.log('checking if order appears on the book...')
    if ((await dvf.getOrders()).find(o => o._id === orderId)) break
    await P.delay(1000)
  }
}
else {
  orderId = orders[0]._id
}

console.log('cancelling orderId', orderId)

const response = await dvf.cancelOrder(orderId)

logExampleResult(response)
