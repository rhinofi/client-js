/**
 * Provides a gas price
 */
const recommendedGasPrice = (dvf) => {
  return dvf.recommendedGasPrices 
    ? parseFloat(dvf.recommendedGasPrices.fast) * 1.02
    : false
}

module.exports = async (dvf) => {
  return dvf.config.gasStationApiKey 
    ? await dvf.eth.getGasStationPrice()
    : recommendedGasPrice(dvf) || dvf.config.defaultGasPrice
}
