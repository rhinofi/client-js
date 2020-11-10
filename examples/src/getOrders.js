const getOrCreateActiveOrder = require('./helpers/getOrCreateActiveOrder')

// Ensure that there is at least one order to get.
await getOrCreateActiveOrder(dvf, starkPrivKey)

const getOrdersResponse = await dvf.getOrders()

logExampleResult(getOrdersResponse)
