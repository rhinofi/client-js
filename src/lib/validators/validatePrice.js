const errorReasons = require('../error/reasons')

module.exports = (dvf, price) => {
  if (!price) {
    return {
      error: 'ERR_PRICE_MISSING',
      reason: errorReasons.ERR_PRICE_MISSING
    }
  }
}
