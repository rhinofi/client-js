const DVFError = require('../DVFError')

module.exports = (dvf, starkTokenId) => {
  const {tokenRegistry} = dvf.config

  if (!tokenRegistry) {
    throw new DVFError('NO_TOKEN_REGISTRY')
  }
  let tokenInfo
  Object.keys(tokenRegistry)
    .forEach((token) => {
      if (tokenRegistry[token].starkTokenId === starkTokenId) {
        tokenInfo = tokenRegistry[token]
      }
    })

  if (!tokenInfo) {
    const validTokens = Object.keys(tokenRegistry)
    throw new DVFError('ERR_INVALID_TOKEN', {token, validTokens})
  }

  return tokenInfo
}
