const errorReasons = require('../error/reasons')

module.exports = (dvf, starkKey) => {
  if (!starkKey) {
    return {
      error: 'ERR_STARK_KEY_MISSING',
      reason: errorReasons.ERR_STARK_KEY_MISSING
    }
  }
}
