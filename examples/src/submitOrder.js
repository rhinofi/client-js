// Submit an order to sell 0.3 Eth for USDT ad 250 USDT per 1 Eth
const symbol = 'ETH:USDT'
const amount = -0.3
const price = 250
const validFor = '0'
const feeRate = ''

const submitOrderResponse = await dvf.submitOrder({
  symbol,
  amount,
  price,
  validFor,
  feeRate,
  starkPrivateKey: starkPrivKey,
  gid: '1', // gid
  cid: '1', // cid
  partnerId: 'P1', // partnerId
  dynamicFeeRate: '0'
})

console.log('submitOrder response ->', submitOrderResponse)
