// Submit an order to sell 0.3 Eth for USDT ad 500 USDT per 1 Eth
const submitOrderResponse = await dvf.submitOrder(
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

console.log("submitOrder response ->", submitOrderResponse)
