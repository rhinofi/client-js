const DVFError = require('../dvf/DVFError')

module.exports = (dvf, withdrawalId) => {
  if (!withdrawalId) {
    throw new DVFError('ERR_INVALID_WITHDRAWAL_ID')
  }
}
