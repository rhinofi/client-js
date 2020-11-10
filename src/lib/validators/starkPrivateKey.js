const DVFError = require('../dvf/DVFError')

module.exports = (dvf, tradingKey) => {
  if (!tradingKey) {
    throw new DVFError('ERR_STARK_PRIVATE_KEY_MISSING')
  }
}
