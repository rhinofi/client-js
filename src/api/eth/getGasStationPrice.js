const { get } = require('request-promise')

/**
 * Provides a safe average gas price
 */

module.exports = async (dvf)  => {
  try {
    const res = await get(`${dvf.config.gasApi}/json/ethgasAPI.json?api-key=${dvf.config.gasStationApiKey || ''}`)
    dvf.config.defaultGasPrice = parseInt((JSON.parse(res).average * 1.25 *100000000))
  } catch(e)  {
    console.log('Error getting safe gas priec, using default ', e)
  }
  return dvf.config.defaultGasPrice
}
