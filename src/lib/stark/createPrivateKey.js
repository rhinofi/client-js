const errorReasons = require('../../lib/error/reasons')
const crypto = require('crypto')
// TODO: Add check to ensure private key generated
//       is less than penderson EC_ORDER
module.exports = () => {
  try {
    crypto.randomBytes(31, (err, buf) => {
      if (err) {
        return {
          error: 'ERR_PRIVATEKEY_CREATION',
          reason: errorReasons.ERR_PRIVATEKEY_CREATION
        }
      }
      return buf.toString('hex')
    })
  } catch (e) {
    return {
      error: 'ERR_PRIVATEKEY_CREATION',
      reason: errorReasons.ERR_PRIVATEKEY_CREATION
    }
  }
}
