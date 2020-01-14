const { post } = require('request-promise')
const validateAssertions = require('../lib/validators/validateAssertions')

module.exports = async (dvf, symbol, nonce, signature) => {
  var url = dvf.config.api + '/r/orderHistory'

  const assertionError = await validateAssertions({ dvf, symbol })
  if (assertionError) return assertionError

  if (!nonce) {
    nonce = Date.now() / 1000 + 30 + ''
    signature = await dvf.sign(nonce.toString(16))
  }

  const data = {
    symbol,
    nonce,
    signature
  }

  return post(url, { json: data })
}
