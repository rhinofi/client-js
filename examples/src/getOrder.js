let orderId
const orders = await dvf.getOrders('ETH:USDT')

console.log('orders', orders)

if (orders.length == 0) {
  console.log('submitting new order')

  const submitedOrderResponse = await dvf.submitOrder(
    'ETH:USDT', // symbol
    -0.3, // amount
    500, // price
    '', // gid
    '', // cid
    '0', // signedOrder
    0, // validFor
    'P1', // partnerId
    '', // feeRate
    '', // dynamicFeeRate
    starkPrivKey
  )

  console.log('submitedOrderResponse', submitedOrderResponse)
  orderId = submitedOrderResponse.orderId
}
else {
  orderId = orders[0]._id
}

console.log('fetching orderId', orderId)

const response = await dvf.getOrder(orderId)

console.log("getOrder response ->", response)
