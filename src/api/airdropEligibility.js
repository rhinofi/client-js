const getGeneric = require('../lib/dvf/get-generic')

module.exports = async (dvf, ethAddress) => {
  if (ethAddress) {
    const endpoint = `/v1/trading/r/airdropEligibility?ethAddress=${ethAddress}`
    return getGeneric(dvf, endpoint)
  }
  return null
}
