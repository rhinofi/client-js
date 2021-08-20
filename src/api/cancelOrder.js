const post = require('../lib/dvf/post-authenticated')
const extractOrderIdsInput = require('../lib/util/extractOrderIdsInput')

const validateAssertions = require('../lib/validators/validateAssertions')

/**
 *
 * @param {Object} orderIdOrCid 'xxx' or { orderId: 'xxx' } or { cid: 'yyy' }
 */
module.exports = async (dvf, orderIdOrCid, nonce, signature) => {
  const input = extractOrderIdsInput(orderIdOrCid)
  validateAssertions(dvf, input)

  const endpoint = '/v1/trading/w/cancelOrder'

  const data = input

  return post(dvf, endpoint, nonce, signature, data)
}
