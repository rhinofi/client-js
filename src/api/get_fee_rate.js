const { get } = require('request-promise')
const _ = require('lodash')

const calculateVolume = require('../lib/bfx/calculateVolume')

// TODO: move address to either /r/get/conf or to ENV variables
const DEVERSIFI_API = 'https://api.deversifi.com/api/v1/feeRate/'

/**
 *
 * Calculate feeRate based on deversifi feeRate rules 
 */
module.exports = async (efx, symbol, amount, price) => {

  const volume = await calculateVolume(symbol, amount, price)

  // fetch freeRate from the api

  const account = efx.get('account')

  const url = DEVERSIFI_API + account

  let feeRates = await get(url, { json: true})

  // filter all fees with threshold below volume
  let feeRate = _.filter(feeRates.fees, (item) => item.threshold <= volume)

  // pick the cheapest one
  feeRate = _.sortBy(feeRate, 'feeBps')[0]

  return {
    feeRate,
    feeRates
  }
}