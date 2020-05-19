const { computeBuySellData } = require('dvf-utils')

const DVFError = require('./DVFError')

module.exports = (dvf, order) => computeBuySellData({
  DVFError,
  getTokenInfo: dvf.token.getTokenInfo
})(order)
