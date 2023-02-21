const getOrCreateActiveOrder = require('./helpers/getOrCreateActiveOrder')

const symbol = 'ETH:USDT'

// Ensure that there is at least one order to get.
await getOrCreateActiveOrder(rhinofi, starkPrivKey, { symbol })

const getOrdersResponse = await rhinofi.getOrders(symbol)

logExampleResult(getOrdersResponse)
