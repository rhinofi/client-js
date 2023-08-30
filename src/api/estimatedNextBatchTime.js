const { request } = require('@rhino.fi/dvf-utils')

module.exports = async dvf => {
  // avoid browser cache with timestamp as querystring
  const t = Date.now()

  const url = `${dvf.config.api}/v1/trading/r/estimatedNextBatchTime?t=${t}`
  try {
    const data = await request.get(url)
    return JSON.parse(data)
  }
  catch(e) {
    return null;
  }
}
