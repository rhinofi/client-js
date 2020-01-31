const errorReasons = require('../error/reasons')

module.exports = (dvf, symbol) => {
  if (!symbol) {
    return {
      error: 'ERR_INVALID_SYMBOL',
      reason: errorReasons.ERR_INVALID_SYMBOL
    }
  }
  if (symbol) {
    const from = symbol.toString().split(':')[0]
    const to = symbol.toString().split(':')[1]
    if (!dvf.token.getTokenInfo(from) || !dvf.token.getTokenInfo(to)) {
      return {
        error: 'ERR_INVALID_SYMBOL',
        reason: errorReasons.ERR_INVALID_SYMBOL
      }
    }
  }
}
