const errorReasons = require('../error/reasons')

module.exports = nonce => {
  if (typeof nonce === 'string') nonce = +nonce

  if (!nonce || isNaN(nonce)) {
    return {
      error: 'ERR_INVALID_NONCE',
      reason: errorReasons.ERR_TOKEN_MISSING || 'ERR_INVALID_NONCE'
    }
  }
  if ((Date.now() / 1000) - nonce > 1000) {
    return {
      error: 'NONCE_IS_TOO_OLD',
      reason: errorReasons.NONCE_IS_TOO_OLD || 'NONCE_IS_TOO_OLD'
    }
  }
}
