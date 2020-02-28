const DVFError = require('../dvf/DVFError')

module.exports = (dvf, starkKeyPair) => {
  if (!starkKeyPair) {
    throw new DVFError('ERR_STARK_KEY_PAIR_MISSING')
  }
}
