const getOrCreateActiveOrder = require('./helpers/getOrCreateActiveOrder')

const symbol = 'ETH:USDT'

// Ensure that there is at least one order to get.
await getOrCreateActiveOrder(dvf, starkPrivKey, { symbol })

const getOrdersResponse = await dvf.getOrders(symbol)

logExampleResult(getOrdersResponse)
