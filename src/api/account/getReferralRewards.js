const getGeneric = require('../../lib/dvf/get-generic')

module.exports = async dvf => {
  const endpoint = '/v1/trading/r/referralRewards'
  const response = await getGeneric(dvf, endpoint)
  return response
}
