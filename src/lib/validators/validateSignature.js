const errorReasons = require('../error/reasons')

module.exports = (signature) => {
  if (!signature) {
    return {
      error: 'ERR_SIGNATURE_MISSING',
      reason: errorReasons.ERR_SIGNATURE_MISSING
    }
  }
}
