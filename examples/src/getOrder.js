const getOrCreateActiveOrder = require('./helpers/getOrCreateActiveOrder')

const order = await getOrCreateActiveOrder(rhinofi, starkPrivKey)

const response = await rhinofi.getOrder(
  // Can be queried with cid (if defined) or order._id
  order.cid ? { cid: order.cid } : { orderId: order._id }
)

logExampleResult(response)
