const { get } = require('request-promise')

module.exports = async (dvf, ethAddress) => {
  if (ethAddress) {
    const response = await get(
      `${dvf.config.api}/v1/trading/r/airdropEligibility?ethAddress=${ethAddress}`
    )
    return response
  }
  return null
}
