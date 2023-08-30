const { request } = require('@rhino.fi/dvf-utils')

module.exports = async (dvf, token) => {
  if (token) {
    const response = await request.get(
      `${dvf.config.api}/v1/trading/r/getTokenHolders?token=${token}`
    )
    return response
  }
  return null
}
