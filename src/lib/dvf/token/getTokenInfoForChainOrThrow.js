const { merge } = require('lodash')

module.exports = (dvf, token, chain) => {
  const result = dvf.token.getTokenInfoOrThrow(token)

  if (chain && result?.chainOverride?.[chain]) {
    return merge(result, result?.chainOverride[chain])
  }

  return result
}
