const DVFError = require('../dvf/DVFError')

module.exports = (dvf, nonce) => {
  if (typeof nonce === 'string') nonce = +nonce

  if (!nonce || isNaN(nonce)) {
    throw new DVFError('ERR_INVALID_NONCE')
  }
  
  if ((Date.now() / 1000) - nonce > 3 * 60 * 60 * 1000) {
    throw new DVFError('NONCE_IS_TOO_OLD')
  }
}
