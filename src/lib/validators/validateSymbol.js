const errorReasons = require('../error/reasons')

module.exports = (symbol) => {
  if (!symbol) {
    return {
      error: 'ERR_INVALID_SYMBOL',
      reason: errorReasons.ERR_INVALID_SYMBOL || 'ERR_INVALID_SYMBOL'
    }
  }
}
