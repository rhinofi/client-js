const { get } = require('request-promise')

module.exports = async (dvf, token) => {
  if (token) {
    const response = await get(
      `${dvf.config.api}/v1/trading/r/getTokenLiquidityLeft?token=${token}`
    )
    return response
  }
  return null
}
