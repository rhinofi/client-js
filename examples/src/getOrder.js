let orderId
const orders = await dvf.getOrders('ETH:USDT')

console.log('orders', orders)

if (orders.length == 0) {
  console.log('submitting new order')

  // Submit an order to buy 0.3 ETH at a rate of 180 USDT per 1 ETH
  const symbol = 'ETH:USDT'
  const amount = 0.3
  const price = 180
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
}
else {
  orderId = orders[0]._id
}

console.log('fetching orderId', orderId)

const response = await dvf.getOrder(orderId)

logExampleResult(response)
