const DVFError = require('../dvf/DVFError')

module.exports = (dvf, amount) => {
  if (amount && typeof amount === 'string') {
    amount = +(amount)
  }

  if (!amount) {
    throw new DVFError('ERR_AMOUNT_MISSING')
  }
  
  if (amount && amount == 0) {
    throw new DVFError('ERR_INVALID_AMOUNT')
  }
}
