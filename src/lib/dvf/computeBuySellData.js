const { computeBuySellData } = require('@rhino.fi/dvf-utils')

const DVFError = require('./DVFError')

module.exports = (dvf, order) => computeBuySellData({
  DVFError,
  getTokenInfo: dvf.token.getTokenInfo
})(order)
