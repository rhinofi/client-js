const get = require('../lib/dvf/get-generic')
const validateAssertions = require('../lib/validators/validateAssertions')

/**
 * @param {String} symbol 'ETH'
 */
module.exports = async (dvf, symbol) => {
  validateAssertions(dvf, {symbol})

  const endpoint = `/market-data/ticker/${symbol}/order-size`

  return get(dvf, endpoint)
}
