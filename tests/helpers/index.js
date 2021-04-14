module.exports = {
  setup: require('./setup'),
  register: require('./register'),
  deposit: require('./deposit'),
  withdraw: require('./withdrawal'),
  drip: require('./drip'),
  testOrders: require('./testOrders'),
  ...require('./util')
}
