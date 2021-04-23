const getGeneric = require('../lib/dvf/get-generic')

/**
 * Get public permissions descriptor
 */
module.exports = (dvf) => {
  const endpoint = '/v1/trading/r/getPublicPermissions'

  return getGeneric(dvf, endpoint)
}
