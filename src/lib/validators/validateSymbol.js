const errorReasons = require('../error/reasons')

module.exports = (efx, symbol) => {
  if (!symbol) {
    return {
      error: 'ERR_INVALID_SYMBOL',
      reason: errorReasons.ERR_INVALID_SYMBOL
    }
  }
  if (symbol) {
    const from = symbol.length === 6 && symbol.substr(0, symbol.length - 3)
    const to = symbol.length === 6 && symbol.substr(-3)
    if (!efx.config.tokenRegistry[from] || !efx.config.tokenRegistry[to]) {
      return {
        error: 'ERR_INVALID_SYMBOL',
        reason: errorReasons.ERR_INVALID_SYMBOL
      }
    }
  }
}
