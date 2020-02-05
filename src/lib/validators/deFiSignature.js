const DVFError = require('../dvf/DVFError')

module.exports = (dvf, signature) => {
  if (!signature) {
    throw new DVFError('ERR_SIGNATURE_MISSING')
  }
}
