const { merge } = require('lodash')
const DVFError = require('../DVFError')

module.exports = (dvf, token) => {
  const { tokenRegistry } = dvf.config

  if (!tokenRegistry) {
    throw new DVFError('NO_TOKEN_REGISTRY')
  }

  let tokenInfo = tokenRegistry[token]
  if (!tokenInfo) {
    const validTokens = Object.keys(tokenRegistry)
    throw new DVFError('ERR_INVALID_TOKEN', { token, validTokens })
  }

  if (tokenInfo.chainOverride) {
    tokenInfo = merge(tokenInfo, tokenInfo.chainOverride)
  }

  return { token, ...tokenInfo }
}
