const errorReasons = require('../error/reasons')

module.exports = (dvf, nonce) => {
  if (typeof nonce === 'string') nonce = +nonce

  if (!nonce || isNaN(nonce)) {
    return {
      error: 'ERR_INVALID_NONCE',
      reason: errorReasons.ERR_INVALID_NONCE
    }
  }
  if (Date.now() - nonce > dvf.defaultNonceAge) {
    return {
      error: 'ERR_NONCE_IS_TOO_OLD',
      reason: errorReasons.ERR_NONCE_OLD
    }
  }
}
