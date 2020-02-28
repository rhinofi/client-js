const DVFError = require('../dvf/DVFError')

module.exports = (dvf, nonce) => {
  if (typeof nonce === 'string') nonce = +nonce

  if (!nonce || isNaN(nonce)) {
    throw new DVFError('ERR_INVALID_NONCE')
  }

  if (Date.now() / 1000 - nonce > dvf.defaultNonceAge) {
    throw new DVFError('NONCE_IS_TOO_OLD')
  }
}
