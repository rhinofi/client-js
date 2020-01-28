const errorReasons = require('../error/reasons')

module.exports = async (dvf, withdrawalId) => {
  if (!withdrawalId) {
    return {
      error: 'ERR_INVALID_WITHDRAWAL_ID',
      reason: errorReasons.ERR_INVALID_WITHDRAWAL_ID
    }
  }
}
