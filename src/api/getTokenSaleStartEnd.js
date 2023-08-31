const get = require('../lib/dvf/get-generic')

module.exports = async (dvf, token) => {
  if (token) {
    const response = await get(
      dvf,
      `${dvf.config.api}/v1/trading/r/getTokenSaleStartEnd?token=${token}`
    )
    return response
  }
  return null
}
