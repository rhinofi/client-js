const DVFError = require('../dvf/DVFError')

module.exports = (dvf, id) => {
  if (!id) {
    throw new DVFError('ERR_INVALID_ID')
  }
}
