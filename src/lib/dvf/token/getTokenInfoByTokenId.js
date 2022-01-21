const DVFError = require('../DVFError')
const _find = require('lodash/find')

module.exports = (dvf, starkTokenId) => {
  const {tokenRegistry} = dvf.config

  if (!tokenRegistry) {
    throw new DVFError('NO_TOKEN_REGISTRY')
  }
  const tokenInfo = _find(tokenRegistry, {
    starkTokenId
  })

  if (!tokenInfo) {
    const validTokens = Object.keys(tokenRegistry)
    throw new DVFError('ERR_INVALID_TOKEN', {validTokens})
  }

  return tokenInfo
}
