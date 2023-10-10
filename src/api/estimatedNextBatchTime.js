const get = require('../lib/dvf/get-generic')

module.exports = async dvf => {
  // avoid browser cache with timestamp as querystring
  const t = Date.now()
  const url = `/v1/trading/r/estimatedNextBatchTime?t=${t}`
  return get(dvf, url)
}
