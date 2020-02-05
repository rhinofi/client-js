const DVFError = require('../dvf/DVFError')

module.exports = (dvf, starkKey) => {
  if (!starkKey) {
    throw new DVFError('ERR_STARK_KEY_MISSING')
  }
}
