let orderId
const orders = await dvf.getOrders('ETH:USDT')

console.log('orders', orders)

if (orders.length == 0) {
  console.log('submitting new order')

  // Submit an order to buy 150 ZRX for ETH at 0.07 ETH for 1 ZRX
  const symbol = 'ZRX:ETH'
  const amount = 150
  const price = 0.07
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
        partnerId: 'P1',    // Optional
        dynamicFeeRate: '0' // Optional
      })

  console.log('submitOrder response ->', submitOrderResponse)
  orderId = submitOrderResponse.orderId
}
else {
  orderId = orders[0]._id
}

console.log('fetching orderId', orderId)

const response = await dvf.getOrder(orderId)

console.log("getOrder response ->", response)
