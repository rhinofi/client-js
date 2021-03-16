const {
  generateAuthMessageForAuthVersion,
  formatNonceForAuthVersion
} = require('dvf-utils')
/**
 * if either message and signature are not provided a
 * new nonce/message and signature are created. if nonce
 * and signature were provided the same are returned back
 */
module.exports = async (dvf, nonce, signature) => {
  if (!(nonce && signature)) {
    nonce = Date.now() / 1000
    const authVersion = dvf.config.DVF.authVersion || 1
    const message = generateAuthMessageForAuthVersion(nonce, authVersion)
    // ex: '1615893628.661' (v1) or 'v2-1615893628.661' (v2)
    nonce = formatNonceForAuthVersion(nonce, authVersion)
    signature = await dvf.sign(message)
  }

  return {nonce, signature}
}
