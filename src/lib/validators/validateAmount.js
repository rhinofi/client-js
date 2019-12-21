const errorReasons = require('../error/reasons')

module.exports = (amount) => {
  if (!amount) {
    return {
      error: 'ERR_AMOUNT_MISSING',
      reason: errorReasons.ERR_AMOUNT_MISSING || 'ERR_AMOUNT_MISSING'
    }
  }
  if (amount && typeof amount === 'string') {
    amount = +(amount)
  }
  if (amount && amount <= 0) {
    return {
      error: 'ERR_INVALID_AMOUNT',
      reason: errorReasons.ERR_INVLAID_AMOUNT || 'ERR_INVALID_AMOUNT'
    }
  }
}
