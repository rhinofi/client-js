const DVFError = require('../dvf/DVFError')

module.exports = (dvf, token) => {
  if (!token) {
    throw new DVFError('ERR_TOKEN_MISSING')
  }

  if (!dvf.token.getTokenInfo(token)) {
    throw new DVFError('ERR_INVALID_TOKEN')
  }
}
