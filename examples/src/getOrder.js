const getOrCreateActiveOrder = require('./helpers/getOrCreateActiveOrder')

const order = await getOrCreateActiveOrder(dvf, starkPrivKey)

const response = await dvf.getOrder(order._id)

logExampleResult(response)
