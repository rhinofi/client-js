const get = require('../lib/dvf/get-authenticated')

/**
 *
 * Retrieve feeRate based on deversifi feeRate rules
 */
module.exports = async (dvf, nonce, signature) => {
  const endpoint = '/v1/trading/r/feeRate'

  return get(dvf, endpoint, nonce, signature)
}
