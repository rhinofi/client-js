const post = require('../lib/dvf/post-authenticated')
const _ = require('lodash')

const calculateVolume = require('../lib/bfx/calculateVolume')

/**
 *
 * Calculate feeRate based on deversifi feeRate rules
 */
module.exports = async (dvf, symbol, amount, price, nonce, signature) => {
  const volume = await calculateVolume(symbol, amount, price)

  const endpoint = '/v1/trading/r/getFeeRates'

  let feeRates = await post(dvf, endpoint, nonce, signature)

  // filter all fees with threshold below volume
  let feeRate = _.filter(feeRates.fees, item => item.threshold <= volume)

  // pick the cheapest one
  feeRate = _.sortBy(feeRate, 'feeBps')[0]

  return {
    feeRate,
    feeRates
  }
}
