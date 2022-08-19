const getGeneric = require('../../lib/dvf/get-generic')

module.exports = async (dvf) => {
  const endpoint = '/v1/trading/r/stampedePotValue'
  return getGeneric(dvf, endpoint)
}
