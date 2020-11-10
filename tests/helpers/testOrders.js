const { sleep } = require('./util')

const testOrders = async (dvf, privateKey, sellToken, buyToken, amount, price) => {
  const submitOrderResponse = await dvf.submitOrder({
      symbol: `${sellToken}:${buyToken}`,
      amount,
      price,
      starkPrivateKey: privateKey
  })
  console.log('submitOrder response ->', submitOrderResponse)

  expect(submitOrderResponse.type).toEqual('EXCHANGE LIMIT')
  expect(submitOrderResponse.tokenSell).toEqual(sellToken)
  expect(submitOrderResponse.tokenBuy).toEqual(buyToken)

  await sleep(20)
  
  const orders = await dvf.getOrders()
  console.log('getOrders response ->', orders)
  expect(orders.length).toEqual(1)
  
  const createdOrder = orders.find(order => order._id === submitOrderResponse._id)
  expect(createdOrder.active).toEqual(true)
  expect(createdOrder.price).toEqual(price)

  const cancelOrderResponse = await dvf.cancelOrder(submitOrderResponse._id)
  console.log('cancelOrder response ->', cancelOrderResponse)

  expect((await dvf.getOrders()).length).toEqual(0)
} 

module.exports = testOrders


