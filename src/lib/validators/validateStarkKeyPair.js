const errorReasons = require('../error/reasons')

module.exports = (dvf, starkKeyPair) => {
  if (!starkKeyPair) {
    return {
      error: 'ERR_STARK_KEY_PAIR_MISSING',
      reason: errorReasons.ERR_STARK_KEY_PAIR_MISSING
    }
  }
}
