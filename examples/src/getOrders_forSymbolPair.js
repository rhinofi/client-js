let orders = await dvf.getOrders('ETH:BTC')

if (orders.length == 0) {

  console.log('no orders for ETH:BTC, submitting one')

  const submitedOrderResponse = await dvf.submitOrder(
    'ETH:BTC', // symbol
    -0.3, // amount
    500, // price
    '', // gid
    '', // cid
    '0', // signedOrder
    0, // validFor
    'P1', // partnerId
    '', // feeRate
    starkPrivKey
  )
}

orders = await dvf.getOrders('ETH:BTC')

console.log("getOrders response ->", orders)
