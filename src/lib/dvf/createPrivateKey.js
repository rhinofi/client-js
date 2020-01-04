const errorReasons = require('../error/reasons')
const crypto = require('crypto')

module.exports = () => {
  try {
    crypto.randomBytes(128, (err, buf) => {
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
