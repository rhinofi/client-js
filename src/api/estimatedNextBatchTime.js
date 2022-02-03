const { get } = require('request-promise')

module.exports = async dvf => {
  // avoid browser cache with timestamp as querystring
  const t = Date.now()

  const url = `${dvf.config.api}/v1/trading/r/estimatedNextBatchTime?t=${t}`
  try {
    const data = await get(url, {headers: { Authorization: dvf.config.apiKey}})
    return JSON.parse(data)
  }
  catch(e) {
    return null;
  }
}
