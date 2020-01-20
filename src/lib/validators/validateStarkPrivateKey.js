const errorReasons = require('../error/reasons')

module.exports = (dvf, starkPrivateKey) => {
  if (!starkPrivateKey) {
    return {
      error: 'ERR_STARK_PRIVATE_KEY_MISSING',
      reason: errorReasons.ERR_STARK_PRIVATE_KEY_MISSING
    }
  }
}
