const DVFError = require('../dvf/DVFError')

module.exports = (dvf, symbol) => {
  if (!symbol) {
    throw new DVFError('ERR_INVALID_SYMBOL')
  }
  
  const from = symbol.toString().split(':')[0]
  const to = symbol.toString().split(':')[1]
  
  if (!dvf.token.getTokenInfo(from) || !dvf.token.getTokenInfo(to)) {
    throw new DVFError('ERR_INVALID_SYMBOL')
  }
}
