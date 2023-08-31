const get = require('../lib/dvf/get-generic')

module.exports = async (dvf, token) => {
  if (token) {
    return get(
      dvf,
      `/v1/trading/r/getTokenLiquidityLeft?token=${token}`
    )
  }
  return null
}
