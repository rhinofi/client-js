const symbol = 'BTC:USDT'

let orders = await dvf.getOrders(symbol)

if (orders.length == 0) {

  console.log(`no orders for ${symbol}, submitting one`)

  // Submit an order to buy 0.02 BTC at a rate of 7000 USDT for 1 BTC
  const amount = 0.02
  const price = 7000
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
}

orders = await dvf.getOrders(symbol)

logExampleResult(orders)
