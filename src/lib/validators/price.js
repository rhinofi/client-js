const DVFError = require('../dvf/DVFError')

module.exports = (dvf, price) => {
  if (!price) {
    throw new DVFError('ERR_PRICE_MISSING')
  }
}
