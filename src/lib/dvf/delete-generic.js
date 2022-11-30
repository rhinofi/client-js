const { request } = require('@rhino.fi/dvf-utils')

module.exports = async (dvf, endpoint, headers = {}) => {
  const url = dvf.config.api + endpoint

  const options = {
    headers
  }

  return request.delete(url, options)
}
