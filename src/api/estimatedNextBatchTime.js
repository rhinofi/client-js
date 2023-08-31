const get = require('../lib/dvf/get-generic')

module.exports = async dvf => {
  // avoid browser cache with timestamp as querystring
  const t = Date.now()

  const url = `${dvf.config.api}/v1/trading/r/estimatedNextBatchTime?t=${t}`
  try {
    const data = await get(dvf, url)
    return JSON.parse(data)
  }
  catch(e) {
    return null;
  }
}
