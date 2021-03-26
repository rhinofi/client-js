const DVFError = require('../DVFError')

module.exports = (dvf, token) => {
  const { tokenRegistry } = dvf.config

  if (!tokenRegistry) {
    throw new DVFError('NO_TOKEN_REGISTRY')
  }

  const tokenInfo = tokenRegistry[token]
  if (!tokenInfo) {
    const validTokens = Object.keys(tokenRegistry)
    throw new DVFError('ERR_INVALID_TOKEN', { token, validTokens })
  }

  return {token, ...tokenInfo}
}
