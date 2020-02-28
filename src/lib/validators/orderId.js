const DVFError = require('../dvf/DVFError')

module.exports = (dvf, orderId) => {
  if (!orderId) {
    throw new DVFError('ERR_INVALID_ORDER_ID')
  }
}
