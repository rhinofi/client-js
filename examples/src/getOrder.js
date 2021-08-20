const getOrCreateActiveOrder = require('./helpers/getOrCreateActiveOrder')

const order = await getOrCreateActiveOrder(dvf, starkPrivKey)

const response = await dvf.getOrder(
  // Can be queried with cid (if defined) or order._id
  order.cid ? { cid: order.cid } : { orderId: order._id }
)

logExampleResult(response)
