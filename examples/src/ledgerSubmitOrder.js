// Submit an order to sell 0.3 Eth for USDT at 250 USDT per 1 Eth
const symbol = 'ETH:USDT'
const amount = -0.3
const price = 200
const validFor = '0'
const feeRate = ''
const ledgerPath= `44'/60'/0'/0'/0`

const submitOrderResponse = await rhinofi.submitOrder({
  symbol,
  amount,
  price,
  ledgerPath,
  validFor,           // Optional
  feeRate,            // Optional
  gid: '1',           // Optional
  cid: '1',           // Optional
  partnerId: 'P1'    // Optional
})

logExampleResult(submitOrderResponse)
