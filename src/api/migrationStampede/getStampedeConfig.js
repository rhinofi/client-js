const getGeneric = require('../../lib/dvf/get-generic')

module.exports = async (dvf) => {
  const endpoint = '/v1/trading/r/stampedeConfig'
  return getGeneric(dvf, endpoint)
}
