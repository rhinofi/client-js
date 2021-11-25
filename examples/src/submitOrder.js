const getPriceFromOrderBook = require('./helpers/getPriceFromOrderBook')

// Submit an order to sell 0.1 Eth for USDT
const symbol = 'ETH:USDT'
const amount = -0.1
const validFor = '0'
const feeRate = ''

// Gets the price from the order book api and cuts 5% to make sure the order will be settled
const tickersData = await dvf.getTickers('ETH:USDT');
const orderBookPrice = getPriceFromOrderBook(tickersData);
const price = orderBookPrice - orderBookPrice * 0.05;

const submitOrderResponse = await dvf.submitOrder({
  symbol,
  amount,
  price,
  starkPrivateKey: starkPrivKey,
  validFor,           // Optional
  feeRate,            // Optional
  gid: '1',           // Optional
  cid: 'mycid-' + Math.random().toString(36).substring(7), // Optional
  partnerId: 'P1'    // Optional
})

logExampleResult(submitOrderResponse)
