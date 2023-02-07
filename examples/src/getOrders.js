const getOrCreateActiveOrder = require('./helpers/getOrCreateActiveOrder')

// Ensure that there is at least one order to get.
await getOrCreateActiveOrder(rhinofi, starkPrivKey)

const getOrdersResponse = await rhinofi.getOrders()

logExampleResult(getOrdersResponse)
