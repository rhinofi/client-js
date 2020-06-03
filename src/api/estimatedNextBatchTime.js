const { get } = require('request-promise')

module.exports = async dvf => {
  const url = dvf.config.api + '/v1/trading/r/estimatedNextBatchTime'
  try {
    const data = await get(url)
    return JSON.parse(data)
  }
  catch(e) {
    return null;
  }
}
